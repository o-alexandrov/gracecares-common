import {
  camel,
  ClientBuilder,
  ClientGeneratorsBuilder,
  generateVerbImports,
  GeneratorMutator,
  GeneratorOptions,
  GeneratorVerbOptions,
  GetterParams,
  GetterProps,
  GetterPropType,
  GetterResponse,
  jsDoc,
  SwrOptions,
  toObjectString,
  Verbs,
} from "@orval/core"
import { fetchResponseTypeName } from "@orval/fetch"

import { generateRequestFunction } from "./client"

const generateSwrImplementation = ({
  operationName,
  swrKeyProperties,
  swrProperties,
  params,
  mutator,
  isRequestOptions,
  response,
  swrOptions,
  props,
  doc,
  pathnameFunction,
  responseTypeName,
  context,
  pathRoute,
  verb,
}: {
  isRequestOptions: boolean
  operationName: string
  swrKeyProperties: string
  swrProperties: string
  params: GetterParams
  props: GetterProps
  response: GetterResponse
  mutator?: GeneratorMutator
  swrOptions: SwrOptions
  doc?: string
  pathnameFunction: string
  responseTypeName: string
  context: any
  pathRoute: string
  verb: any
}) => {
  const hasPathParamsInHook = props.some(
    (prop) =>
      prop.type === GetterPropType.PARAM ||
      prop.type === GetterPropType.NAMED_PATH_PARAMS,
  )

  const swrProps = swrProperties

  // Check if route needs protection (no security defined in OpenAPI spec)
  const routeContext = context.specs[context.specKey].paths[pathRoute][verb]
  const isProtected = !routeContext?.security

  // Check if the response schema has paginated: true by accessing the OpenAPI spec
  let isPaginated: boolean | undefined = false
  try {
    const routeContext = context.specs[context.specKey].paths[pathRoute][verb]
    const okResponse = routeContext?.responses?.[200]
    const responseSchema = okResponse?.content?.[`application/json`]?.schema

    // Helper function to check if a schema or any of its variants is paginated
    const checkPaginated = (schema: any): boolean | undefined => {
      if (!schema) return
      if (schema.paginated === true) return true // Direct check for paginated property

      // Handle $ref references by looking up the referenced schema in components
      if (schema.$ref && typeof schema.$ref === `string`) {
        const refPath = schema.$ref.replace(`#/components/schemas/`, ``)
        const referencedSchema =
          context.specs[context.specKey]?.components?.schemas?.[refPath]
        return checkPaginated(referencedSchema)
      }

      if (schema.oneOf && Array.isArray(schema.oneOf)) {
        return schema.oneOf.some((variant: any) => checkPaginated(variant)) // Check oneOf variants
      }
    }

    isPaginated = checkPaginated(responseSchema)
  } catch (error) {
    // If we can't access the schema, default to non-paginated
    isPaginated = false
  }

  // Choose the appropriate hook based on pagination
  const hookName = isPaginated ? `usePaginated` : `use`
  const configType = isPaginated ? `ConfigPaginated` : `ConfigNonPaginated`

  // Generate the new simple hook format
  const trimmedSwrProps = swrProps.replace(/,\s*$/, ``) // Remove trailing comma
  const hookParams = trimmedSwrProps
    ? [trimmedSwrProps, `config?: ${configType}`]
    : [`config?: ${configType}`]

  // Remove "Get" from the beginning of operationName for hook names
  const hookOperationName = operationName.startsWith(`get`)
    ? operationName.slice(3) // Remove "get" prefix
    : operationName

  // Generate proper hook name: use + camelCase(hookOperationName)
  const hookFunctionName = `use${hookOperationName}`

  // Check if the path function needs parameters (path params or query params)
  const hasQueryParams = props.some(
    (prop) => prop.type === GetterPropType.QUERY_PARAM,
  )
  const hasAnyPathFunctionParams = hasPathParamsInHook || hasQueryParams

  // For static paths without parameters, use the path variable directly
  // For paths with parameters, call the function
  const pathExpression = hasAnyPathFunctionParams
    ? `${hasPathParamsInHook ? `pathParams && ` : ``}${pathnameFunction}(${swrKeyProperties})`
    : pathnameFunction

  // Handle union types correctly for both paginated and non-paginated responses
  let finalType = responseTypeName

  // First, remove undefined from all hook types (both paginated and non-paginated)
  if (responseTypeName.includes(` | undefined`)) {
    finalType = responseTypeName.replace(` | undefined`, ``)
  }

  // Then apply pagination transformations if needed
  if (isPaginated) {
    if (finalType.includes(` | `)) {
      // Handle union types - wrap each type with ['items'][number]
      const parts = finalType.split(` | `)
      const transformedParts = parts.map(
        (part) => `${part.trim()}['items'][number]`,
      )
      finalType = transformedParts.join(` | `)
    } else {
      // Simple type without union
      finalType = `${finalType}['items'][number]`
    }
  }

  const useHookImplementation = `${doc}export const ${hookFunctionName} = (${hookParams.join(`, `)}) => {
  return ${hookName}<${finalType}>(
    ${pathExpression},
    config,${
      isProtected
        ? `
    true`
        : ``
    }
  )
}`

  return useHookImplementation
}

const generateSwrHook = (
  {
    queryParams,
    operationName,
    body,
    props,
    verb,
    params,
    override,
    mutator,
    response,
    summary,
    deprecated,
  }: GeneratorVerbOptions,
  { route, context, pathRoute }: GeneratorOptions,
): string => {
  const isRequestOptions = override?.requestOptions !== false
  const doc = jsDoc({ summary, deprecated })

  if (verb !== Verbs.GET) return `` // Only generate hooks for GET methods

  // Separate path parameters from other props
  const pathParams = props.filter(
    (prop) =>
      prop.type === GetterPropType.PARAM ||
      prop.type === GetterPropType.NAMED_PATH_PARAMS,
  )
  const nonPathProps = props.filter(
    (prop) =>
      prop.type !== GetterPropType.PARAM &&
      prop.type !== GetterPropType.NAMED_PATH_PARAMS &&
      prop.type !== GetterPropType.HEADER,
  )

  const hasPathParams = pathParams.length > 0

  // Generate path parameters object type for hook signature
  const pathParamsType = hasPathParams
    ? `pathParams: Falsy | {${pathParams
        .map((param) => {
          if (param.type === GetterPropType.NAMED_PATH_PARAMS) {
            // Fix duplicated property names like user: user: string
            return param.destructured.replace(/(\w+):\s*\1:\s*/g, `$1: `)
          } else {
            // Also fix for definition, just in case
            return `${param.name}: ${param.definition}`.replace(
              /(\w+):\s*\1:\s*/g,
              `$1: `,
            )
          }
        })
        .join(`, `)}}`
    : ``

  // Generate hook properties for the SWR key
  const swrKeyProperties: string[] = []
  if (hasPathParams) {
    swrKeyProperties.push(`pathParams`)
  }
  nonPathProps.forEach((param) => {
    if (param.type === GetterPropType.BODY) {
      swrKeyProperties.push(body.implementation)
    } else if (param.type === GetterPropType.QUERY_PARAM) {
      swrKeyProperties.push(param.name)
    } else {
      swrKeyProperties.push(param.name)
    }
  })

  const swrKeyPropertiesStr = swrKeyProperties.join(`,`)

  // Generate hook function arguments
  const hookArgs: string[] = []
  if (hasPathParams) {
    hookArgs.push(pathParamsType)
  }
  nonPathProps.forEach((param) => {
    if (param.type === GetterPropType.BODY) {
      hookArgs.push(`${param.name}: ${param.definition}`)
    } else if (param.type === GetterPropType.QUERY_PARAM) {
      // Clean up duplicated parameter names in definition
      const cleanDefinition = param.definition
        .replace(/^params\??\s*:\s*/, ``)
        .trim()
      hookArgs.push(`${param.name}?: ${cleanDefinition} | Falsy`)
    } else {
      // Clean up duplicated parameter names in definition
      const cleanDefinition = param.definition
        .replace(/^params\??\s*:\s*/, ``)
        .trim()
      hookArgs.push(`${param.name}: ${cleanDefinition}`)
    }
  })

  const swrProperties = hookArgs.join(`,`)

  const pathnameFunction = camel(`${operationName}-path`)

  // Generate the same response type name as used in the client functions
  // Transform "void" to "undefined" for better TypeScript semantics
  const transformedSuccessType = response.definition.success.replace(
    /\bvoid\b/g,
    `undefined`,
  )

  const skipGeneration = true
  // Don't generate "use" hook if it doesn't return data (returns undefined)
  if (
    transformedSuccessType === `undefined` ||
    transformedSuccessType.trim() === `undefined` ||
    skipGeneration
  ) {
    return ``
  }

  const responseTypeName = fetchResponseTypeName(
    override.fetch.includeHttpResponseReturnType,
    transformedSuccessType,
    operationName,
  )

  const swrImplementation = generateSwrImplementation({
    operationName,
    swrKeyProperties: swrKeyPropertiesStr,
    swrProperties,
    params,
    props,
    mutator,
    isRequestOptions,
    response,
    swrOptions: override.swr,
    doc,
    pathnameFunction,
    responseTypeName,
    context,
    pathRoute,
    verb,
  })

  return swrImplementation
}

export const generateSwr: ClientBuilder = (verbOptions, options) => {
  const imports = generateVerbImports(verbOptions)
  const functionImplementation = generateRequestFunction(verbOptions, options)
  const hookImplementation = generateSwrHook(verbOptions, options)

  return {
    implementation: `${functionImplementation}\n\n${hookImplementation}`,
    imports,
  }
}

export const apiClientBuilder: ClientGeneratorsBuilder = {
  client: generateSwr,
  dependencies: () => [
    // {
    //   exports: [
    //     { name: `use`, values: true },
    //     { name: `usePaginated`, values: true },
    //     { name: `ConfigPaginated` },
    //     { name: `ConfigNonPaginated` },
    //   ],
    //   dependency: `@gracecares-ai/frontend-toolkit/src/plugins/http`,
    // },
    {
      exports: [{ name: `unknownToSk`, values: true }],
      dependency: `@gracecares-ai/data-schema/src/schemas/attribute/username`,
    },
  ],
}
