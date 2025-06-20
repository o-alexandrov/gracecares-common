import * as attr from "@gracecares-ai/data-schema/src/schemas/attribute"
import * as commonHelpers from "@gracecares-ai/helpers"

import { getDefinition, validationToString } from "./attribute"
import { mergeDescription, parseDescription } from "./description"

// Global collection for union schemas (oneOf, anyOf) that will be extracted into separate named schemas
const unionSchemas: Record<string, any> = {}
export const getUnionSchemas = (): Record<string, any> => ({
  ...unionSchemas,
})

// Helper function to generate meaningful schema names from titles and operation context
export const generateSchemaName = (
  title: string,
  operationContext: string,
): string => {
  // Convert title to PascalCase and combine with operation context
  const titlePascalCase = title
    .replace(/[^a-zA-Z0-9\s]/g, ``) // Remove special characters
    .split(/\s+/) // Split by whitespace
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(``)

  return `${operationContext}${titlePascalCase}`
}

// Function to register a union schema variant and return its reference
export const registerUnionSchema = (
  schemaVariant: any,
  operationContext?: string,
): string => {
  if (!schemaVariant.title) {
    throw new Error(`Union schema variant must have a title property`)
  }

  if (!operationContext) {
    throw new Error(
      `Operation context is required for generating meaningful schema names`,
    )
  }

  const schemaName = generateSchemaName(schemaVariant.title, operationContext)

  // Create the schema without the title (title is used for naming only)
  const { title, ...schemaWithoutTitle } = schemaVariant

  // Process the schema with full processing pipeline to ensure regex conversion
  unionSchemas[schemaName] = schema(schemaWithoutTitle as definition)

  return `#/components/schemas/${schemaName}`
}

type definition = NonNullable<OA3.ResponseSchema> & {
  anyOf?: OA3.ResponseOption[]
  $ref?: string // reference to another schema
}
interface processObjectParams {
  isRequestBody?: true
  returnPlain?: true // whether to return a plain OpenAPI spec w/o references
  operationContext?: string // context for generating meaningful oneOf/anyOf schema names
}

export const processObject = (
  object: OA3.Object,
  params: processObjectParams = {},
) => {
  // Handle union types at the object level first (for items that have oneOf/anyOf instead of properties)
  const objectWithPossibleUnion = object as OA3.Object & {
    oneOf?: any[]
    anyOf?: any[]
  }
  if (
    (objectWithPossibleUnion.oneOf || objectWithPossibleUnion.anyOf) &&
    params.operationContext
  ) {
    // Register each union variant individually if they have titles
    const unionVariants =
      objectWithPossibleUnion.oneOf || objectWithPossibleUnion.anyOf
    unionVariants?.forEach((variant) => {
      if (variant.title) {
        registerUnionSchema(variant, params.operationContext)
      }
    })
  }

  const properties = {} as {
    [key: string]: OA3.SchemaObject | { $ref: string }
  }
  const propertiesRequired: string[] = []

  if (object.properties) {
    for (const attributeName of Object.keys(object.properties as any)) {
      if (!attr[attributeName]) {
        throw new Error(
          `Attribute "${attributeName}" is NOT defined in data-schema/src/schemas/attribute/index.ts file`,
        )
      }

      const { required, ...attributeProps } = object.properties[attributeName]!
      if (required) propertiesRequired.push(attributeName)

      const name = attr[attributeName].name
      // Generate operation context for item-level attributes to enable union registry
      const attributeOperationContext = params.operationContext
        ? // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          `${params.operationContext}${name.charAt(0).toUpperCase() + name.slice(1)}${attributeProps.variant ? `${attributeProps.variant.charAt(0).toUpperCase() + attributeProps.variant.slice(1)}` : ``}` // eslint-disable-line @typescript-eslint/restrict-plus-operands
        : undefined
      const definition = schema(
        getDefinition(attributeName as any, attributeProps) as any,
        { operationContext: attributeOperationContext },
      )

      const ref = {
        $ref: `#/components/schemas/${name}${attributeProps.variant ? `_${attributeProps.variant}` : ``}`,
        ...(attributeProps.descriptionAdditional && {
          description: parseDescription(attributeProps.descriptionAdditional),
        }),
      }

      if (params.isRequestBody) {
        delete definition.readOnly // there's no need to mark the attribute as read-only for requests (it's read-only for responses)

        if (attributeProps.removable) {
          delete definition.default // when making an attribute removable, we don't want to set a default value

          const commonDesc = `- changing value to \`""\` (empty string) removes the attribute from the item`

          if (attributeProps.immutable) {
            delete definition.format
            properties[name] = {
              ...definition,
              description: mergeDescription(
                definition.description,
                `The attribute can only be removed.\n${commonDesc}`,
              ),
              type: `string`,
              enum: [``],
            }
          } else {
            properties[name] = {
              anyOf: [
                { title: `New value`, ...definition },
                {
                  title: `CMD to remove property`,
                  description: commonDesc,
                  type: `string`,
                  enum: [``],
                },
              ],
            }
          }
          continue
        }
      }

      properties[name] = params.returnPlain ? definition : ref
    }
  }

  if (object._dangerousUndocumentedProperties) {
    for (const attributeName of Object.keys(
      object._dangerousUndocumentedProperties,
    )) {
      const { required, ...definition } =
        object._dangerousUndocumentedProperties[attributeName]
      if (required) propertiesRequired.push(attributeName)

      properties[attributeName] = schema(definition as any)
    }
  }

  // @ts-ignore can have "description" property
  const { _dangerousUndocumentedProperties, paginated, description, ...rest } =
    object

  const response = {
    ...rest, // to be able to override props above
    description: parseDescription(description),
    required: propertiesRequired,
    properties,
  } as const

  return {
    /**
     * By default, we remove unexpected (undeclared) properties
     *   - to not pollute the receiver and due to security concerns
     *   - you can override this by passing "additionalProperties"
     * @see https://apisecurity.io/encyclopedia/content/oasv3/datavalidation/schema/v3-schema-object-additionalproperties-true.htm
     */
    additionalProperties: false,
    ...(paginated
      ? {
          type: `object`,
          paginated: true, // to be able to distinguish paginated responses in "orval" generator
          properties: {
            items: {
              type: `array`,
              description: `List of items in the current page`,
              items: response,
            },
            page: { $ref: `#/components/schemas/${attr.page.name}` },
          },
          required: [`items`], // next page might not exist
        }
      : response),
  } satisfies OA3.SchemaObject
}

const convertRegexToPattern = (definition: OA3.Attribute) => {
  if (definition.regex) {
    ;(definition as OA3.SchemaObject).pattern = validationToString(
      definition.regex,
    )
    delete definition.regex
  }
}

const checkShouldProcess = (definition: definition) =>
  definition.type === `object` ||
  definition.type === `array` ||
  Boolean(definition.anyOf || definition.oneOf)

export const schema = (
  definition: definition,
  params?: processObjectParams,
): OA3.SchemaObject => {
  if (definition.$ref) return definition as OA3.SchemaObject

  const shouldProcess = checkShouldProcess(definition)
  if (!shouldProcess) {
    const processed = definition as OA3.Attribute
    convertRegexToPattern(processed)
    processed.description = parseDescription(processed.description)
    return processed as OA3.SchemaObject
  }

  let duplicate = commonHelpers.cloneDeep(definition)

  switch (true) {
    case duplicate.type === `object`:
      duplicate = processObject(duplicate, params) as unknown as definition
      break

    case duplicate.type === `array`:
      // @ts-ignore can have "description" property
      duplicate.description = parseDescription(duplicate.description)
      // Pass operationContext to array items processing to enable union registry for nested anyOf
      duplicate.items = schema(duplicate.items as any, params) as any
      break

    case Boolean(duplicate.anyOf || duplicate.oneOf):
      const key = duplicate.anyOf ? `anyOf` : `oneOf`

      // Extract union variants with titles into separate schemas for oneOf and anyOf
      if (
        params?.operationContext &&
        duplicate[key]?.every((variant: any) => variant.title)
      ) {
        // All variants have titles, extract them into separate schemas
        const extractedRefs = duplicate[key]?.map((variant: any) => {
          const ref = registerUnionSchema(variant, params.operationContext)
          return { $ref: ref }
        })
        // Replace the entire structure with a union of references
        duplicate = {
          ...duplicate,
          [key]: extractedRefs,
        } as unknown as definition
      } else {
        // Fallback to default processing for cases without titles, with mixed titles
        ;(duplicate as any)[key] = duplicate[key]?.map((variant: any) =>
          schema(variant, params),
        )
      }
      break
  }

  return duplicate as OA3.SchemaObject
}
