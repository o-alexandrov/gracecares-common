import {
  camel,
  ClientHeaderBuilder,
  generateFormDataAndUrlEncodedFunction,
  GeneratorMutator,
  GeneratorOptions,
  GeneratorVerbOptions,
  GetterPropType,
  GetterResponse,
  pascal,
  toObjectString,
} from "@orval/core"
import { fetchResponseTypeName } from "@orval/fetch"

export const generateRequestFunction = (
  {
    queryParams,
    headers,
    operationName,
    response,
    mutator,
    body,
    props,
    verb,
    formData,
    formUrlEncoded,
    override,
  }: GeneratorVerbOptions,
  { route, context, pathRoute }: GeneratorOptions,
) => {
  const isFormData = !override?.formData.disabled
  const isFormUrlEncoded = override?.formUrlEncoded !== false

  const getPathnameVarName = camel(`${operationName}-path`)

  // Separate path parameters from query parameters
  const pathParams = props.filter(
    (prop) =>
      prop.type === GetterPropType.PARAM ||
      prop.type === GetterPropType.NAMED_PATH_PARAMS,
  )
  const queryParamsProps = props.filter(
    (prop) => prop.type === GetterPropType.QUERY_PARAM,
  )

  // Create path parameters object type and destructuring
  const hasPathParams = pathParams.length > 0
  const pathParamsType = hasPathParams
    ? `pathParams: {${pathParams
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

  const queryParamsType =
    queryParamsProps.length > 0
      ? `${queryParamsProps[0].name}?: ${(queryParamsProps[0]?.definition || `any`).replace(/^params\??\s*:\s*/, ``)} | Falsy`
      : ``

  const getUrlFnProps = [pathParamsType, queryParamsType]
    .filter(Boolean)
    .join(`, `)

  const queryParamsSuffix = queryParams ? `\${queryString(params)}` : ``

  route = route.replace(/^\//, ``) // Remove leading slash because we add it in "orval/fetch.ts"
  // Transform route template to use pathParams object
  route = hasPathParams
    ? route.replace(/\$\{(\w+)\}/g, (match, paramName) => {
        // Special handling for username parameter - wrap with unknownToSk()
        if (paramName === "username") {
          return `\${unknownToSk(pathParams.${paramName})}`
        }
        return `\${pathParams.${paramName}}`
      })
    : route

  // If there are no path parameters and no query parameters, make it a literal string
  const hasAnyParams = hasPathParams || queryParamsProps.length > 0
  const getUrlFnImplementation = hasAnyParams
    ? `export const ${getPathnameVarName} = (${getUrlFnProps}) =>
  \`${route}${queryParamsSuffix}\``
    : `export const ${getPathnameVarName} = \`${route}\``

  const isContentTypeNdJson = (contentType: string) =>
    contentType === `application/nd-json` ||
    contentType === `application/x-ndjson`

  const isNdJson = response.contentTypes.some(isContentTypeNdJson)

  // Transform "void" to "undefined" for better TypeScript semantics
  const successType = isNdJson ? `Response` : response.definition.success
  const transformedSuccessType = successType.replace(/\bvoid\b/g, `undefined`)

  const responseTypeName = fetchResponseTypeName(
    override.fetch.includeHttpResponseReturnType,
    transformedSuccessType,
    operationName,
  )

  const allResponses = [...response.types.success, ...response.types.errors]
  if (allResponses.length === 0) {
    allResponses.push({
      contentType: ``,
      hasReadonlyProps: false,
      imports: [],
      isEnum: false,
      isRef: false,
      key: `default`,
      schemas: [],
      type: `unknown`,
      value: `unknown`,
    })
  }
  const nonDefaultStatuses = allResponses
    .filter((r) => r.key !== `default`)
    .map((r) => r.key)
  const responseDataTypes = allResponses
    .map(
      (r) => `export type ${responseTypeName}${pascal(r.key)} = {
  ${isContentTypeNdJson(r.contentType) ? `stream: Response` : `data: ${r.value || `unknown`}`}
  status: ${
    r.key === `default`
      ? nonDefaultStatuses.length
        ? `Exclude<HTTPStatusCodes, ${nonDefaultStatuses.join(` | `)}>`
        : `number`
      : r.key
  }
}`,
    )
    .join(`\n\n`)

  const compositeName = `${responseTypeName}Composite`
  const compositeResponse = `${compositeName} = ${allResponses.map((r) => `${responseTypeName}${pascal(r.key)}`).join(` | `)}`

  const responseTypeImplementation = override.fetch
    .includeHttpResponseReturnType
    ? `${responseDataTypes}
    
export type ${compositeResponse};
    
export type ${responseTypeName} = ${compositeName} & {
  headers: Headers;
}\n\n`
    : ``

  // Create function arguments with pathParams object
  const nonPathProps = props.filter(
    (prop) =>
      prop.type !== GetterPropType.PARAM &&
      prop.type !== GetterPropType.NAMED_PATH_PARAMS,
  )

  const pathParamsArg = hasPathParams ? pathParamsType : ``
  const otherArgs = toObjectString(nonPathProps, `implementation`)

  const allArgs = [pathParamsArg, otherArgs].filter(Boolean).join(`, `)
  const args = allArgs
  const returnType = `Promise<${responseTypeName}>`

  // Only include method if it's not POST (since POST is the default)
  const fetchMethodOption =
    verb.toUpperCase() !== `POST` ? `method: \`${verb.toUpperCase()}\`` : ``
  const fetchBodyOption = body.implementation
    ? `data: ${body.implementation}`
    : ``

  // Check if route needs protection (no security defined in OpenAPI spec)
  const routeContext = context.specs[context.specKey].paths[pathRoute][verb]
  const isProtected = !routeContext?.security
  const protectedOption = isProtected ? `protected: true` : ``

  // Build the options array and filter out empty ones
  const optionParts = [
    fetchMethodOption,
    fetchBodyOption,
    protectedOption,
  ].filter(Boolean)

  // Build the path function call arguments
  const pathFnCallArgs: string[] = []
  if (hasPathParams) {
    pathFnCallArgs.push(`pathParams`)
  }
  if (queryParamsProps.length > 0) {
    pathFnCallArgs.push(queryParamsProps[0].name)
  }
  const pathFnCallArgsStr = pathFnCallArgs.join(`, `)

  // Use direct string reference if no parameters, otherwise call as function
  const pathReference = hasAnyParams
    ? `${getPathnameVarName}(${pathFnCallArgsStr})`
    : getPathnameVarName

  const fetchFnOptions = `${pathReference}, {
    ${optionParts.join(`,\n    `)}
  }`
  const fetchResponseImplementation = isNdJson
    ? `const stream = await fetch(${fetchFnOptions})

  ${override.fetch.includeHttpResponseReturnType ? `return { status: stream.status, stream, headers: stream.headers }` : `return stream`}
  `
    : `const res = await fetch(${fetchFnOptions})

  const body = [204, 205, 304].includes(res.status) ? null : await res.text()
  const data: ${responseTypeName}${override.fetch.includeHttpResponseReturnType ? `['data']` : ``} = body ? JSON.parse(body) : {}

  ${override.fetch.includeHttpResponseReturnType ? `return { data, status: res.status, headers: res.headers } as ${responseTypeName}` : `return data`}
`
  const customFetchResponseImplementation = `return ${mutator?.name}<${responseTypeName}>(${fetchFnOptions});`

  const bodyForm = generateFormDataAndUrlEncodedFunction({
    formData,
    formUrlEncoded,
    body,
    isFormData,
    isFormUrlEncoded,
  })

  const fetchImplementationBody = mutator
    ? customFetchResponseImplementation
    : fetchResponseImplementation

  const fetchImplementation = `export const ${operationName} = async (${args}): ${returnType} => {
  ${bodyForm ? `  ${bodyForm}` : ``}
  ${fetchImplementationBody}
}`

  const implementation =
    responseTypeImplementation +
    `${fetchImplementation}\n` +
    `${getUrlFnImplementation}\n`

  return implementation
}

export const getSwrRequestOptions = (mutator?: GeneratorMutator) => {
  if (mutator?.hasSecondArg) {
    return `request?: SecondParameter<typeof ${mutator.name}>`
  } else {
    return `fetch?: RequestInit`
  }
}

export const getSwrErrorType = (
  response: GetterResponse,
  mutator?: GeneratorMutator,
) => {
  if (mutator) {
    return mutator.hasErrorType
      ? `ErrorType<${response.definition.errors || `unknown`}>`
      : response.definition.errors || `unknown`
  } else {
    return `Promise<${response.definition.errors || `unknown`}>`
  }
}

export const getSwrRequestSecondArg = (mutator?: GeneratorMutator) => {
  if (mutator?.hasSecondArg) {
    return `request: requestOptions`
  } else {
    return `fetch: fetchOptions`
  }
}

export const getHttpRequestSecondArg = (mutator?: GeneratorMutator) => {
  if (mutator?.hasSecondArg) {
    return `requestOptions`
  } else {
    return `fetchOptions`
  }
}
