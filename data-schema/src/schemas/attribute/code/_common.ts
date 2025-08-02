import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const regex: DataSchema.Validation[] = [
  helpers.regexOnlyNumbers, //
]

export const setName = <v extends string>(v: v) => `code${v}` as const

export const setDefinition = (schema: {
  description: string
  example: string
}): OA3.Attribute => ({
  type: `string`,
  ...schema,
})
