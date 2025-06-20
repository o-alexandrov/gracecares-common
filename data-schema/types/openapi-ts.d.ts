type WithTitle<Obj> = Obj & { title: string }

/* eslint-disable @typescript-eslint/no-floating-promises */
declare namespace OA3 {
  import(`openapi3-ts/dist/oas31`)
  import type { OperationObject, SchemaObject } from "openapi3-ts/dist/oas31"
  import(`type-fest`)
  import type * as TF from "type-fest"

  import(`../src/schemas/attribute`)
  import type * as attr from "../src/schemas/attribute"
  import(`../src/schemas/item`)
  import type * as items from "../src/schemas/item"
  import(`../scripts/openapi-generator/openapi-spec/post-process/responses`)
  import type { StatusCodesNumbersWOGloballyUsed } from "../scripts/openapi-generator/openapi-spec/post-process/responses"
  export type * from "openapi3-ts/dist/oas31"

  /**
   * `string[]` is concatenated (joined) with line breaks; it exists to:
   * - make long descriptions more readable
   * - improve formatting of the description
   */
  export type Description = string | (string | false)[]

  type attributes = typeof attr
  export type attribute = keyof attributes

  export type attributeConfig = TF.MergeExclusive<
    { variants: Variants },
    { definition: Attribute }
  >

  type checkWhetherMustAddVariant<A extends attribute> =
    attributes[A][`variants`] extends Record<string, unknown>
      ? { variant: keyof attributes[A][`variants`] }
      : {}

  export type attributeProps<A extends attribute = attribute> =
    checkWhetherMustAddVariant<A> & {
      exampleOverride?: string
      descriptionAdditional?: Description
    }

  type GetTypeProperties<extraFields extends Record<string, unknown>> =
    /** Do NOT wrap with TF.RequireAtLeastOne as it'd introduce circular reference type error */
    {
      [A in attribute]?: extraFields & attributeProps<A>
    }

  export type Properties<IsRequestBody = false> = GetTypeProperties<
    { required?: true } & (IsRequestBody extends true
      ? TF.MergeExclusive<
          {
            removable: true // the attribute can be removed
            immutable?: true // the attribute can't be changed (only removed)
          },
          {}
        >
      : {})
  >
  export type Property<IsRequestBody = false> = NonNullable<
    Properties<IsRequestBody>[attribute]
  >

  export type PathParameters = GetTypeProperties<{
    name?: string // name override (e.g. "productID" -> "product")
  }>
  export type QueryParameters = GetTypeProperties<{
    name?: string // name override (e.g. "productID" -> "product")
    required?: true // whether the query parameter is required
  }>

  type Primitive<type extends string | boolean | number> = TF.MergeExclusive<
    { example: type },
    { enum: type[] | readonly type[] }
  > & {
    default?: type
  }

  type AttributePrimitive = TF.MergeExclusive<
    Omit<Primitive<boolean>, `example`> & { type: `boolean` },
    TF.MergeExclusive<
      Primitive<string> & {
        type: `string`
        regex?: DataSchema.ValidationRegExp[]
        /** transforms value before validation */
        preprocess?:
          | `trim`
          | `trimAndLowerCase`
          | `trimAndUpperCase`
          | ((value) => string) // "value" is a string before preprocessing; "string" is the output (preprocessed) value
      },
      Primitive<number> & {
        type: `number` // we don't want to allow "integer" here; if you need "integer", you should also set "format"
        format?: `int32` | `int64` | `float` | `double`
        minimum?: number
        maximum?: number
      }
    >
  >

  export type Attribute = TF.MergeExclusive<
    TF.MergeExclusive<
      { anyOf: WithTitle<Attribute>[] },
      { description: Description } & Pick<
        SchemaObject,
        `externalDocs` | `readOnly`
      > &
        TF.MergeExclusive<TF.MergeExclusive<Object, List>, AttributePrimitive>
    >,
    { $ref: string }
  >
  export type Item = TF.MergeExclusive<
    Properties,
    { anyOf: WithTitle<Object>[] }
  >

  export type _DangerousUndocumentedProperties = Record<
    string,
    Attribute & { required?: true }
  >

  /**
   * @notes
   *   - `example` property is generated, because properties of an object must have an `example`
   */
  interface ObjectCommon<IsRequestBody = false> {
    type: `object`
    properties?: Properties<IsRequestBody>
    /**
     * ## You can specify one-off (non-reusable) attributes
     *   - use this ONLY if you think the attribute is NOT reusable
     *     if the attribute is reusable, refer to `How to use an attribute` in the README file
     */
    _dangerousUndocumentedProperties?: _DangerousUndocumentedProperties
    maxProperties?: number
    minProperties?: number
    /**
     * ## Whether you allow additional properties
     * @default false (only allow properties defined in `properties` & `_dangerousUndocumentedProperties`)
     */
    additionalProperties?: true
    paginated?: true
  }
  export type Object<IsRequestBody = false> = TF.RequireAtLeastOne<
    ObjectCommon<IsRequestBody>,
    `properties` | `_dangerousUndocumentedProperties`
  >

  export interface List {
    type: `array`
    items: TF.MergeExclusive<
      Omit<Attribute, `description`>,
      TF.RequireExactlyOne<{
        anyOf: WithTitle<Omit<Attribute, `description`>>[]
        oneOf: WithTitle<Omit<Attribute, `description`>>[]
      }>
    > & {
      description?: Description
    }
    example?: any[]
    uniqueItems?: boolean
    maxItems?: number
    minItems?: number
  }

  export type VariantOptions = keyof typeof items

  export type Variants = {
    [key in VariantOptions]?: Attribute
  } & {
    [key: string]: Attribute
  }

  export type ResponseOption = WithTitle<Object>
  export type ResponseSchema = TF.MergeExclusive<
    TF.MergeExclusive<Object, List>,
    { oneOf: ResponseOption[] }
  >

  type RequestObject = Omit<Object<true>, `type`>
  /**
   * Typings to define REST API endpoint
   * @see OperationObject
   */
  export interface Path {
    /** Title of the request */
    summary: string

    /** How the API endpoint responds to requests */
    responses: TF.RequireAtLeastOne<
      Record<
        StatusCodesNumbersWOGloballyUsed,
        TF.MergeExclusive<
          { description?: Description },
          { schema: ResponseSchema; description?: Description }
        >
      >
    >

    pathParameters?: PathParameters
    queryParameters?: QueryParameters

    /** Paragraph beneath the title */
    description?: Description

    /** Whether the request has a body (i.e. the consumer of the API sends data to the endpoint) */
    requestBody?: TF.MergeExclusive<
      RequestObject,
      {
        /**
         * Do NOT use
         *   - `oneOf` as it validates the request body against exactly one of the subschemas
         *     in other words, the request body must match exactly one of the subschemas
         *   - `allOf` as it validates the request body against all the subschemas
         *     in other words, the request body must match all of the subschemas
         *
         * We need to use `anyOf` because it means the data must be valid against one OR more of the subschemas at the same time
         * @see https://swagger.io/docs/specification/data-models/oneof-anyof-allof-not
         */
        anyOf: WithTitle<RequestObject>[] // "anyOf" validates the value against all the subschemas
      }
    >
  }
}
