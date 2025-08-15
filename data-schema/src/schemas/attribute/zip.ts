import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `zip`

export const regex: DataSchema.ValidationRegExp[] = [
  helpers.hasLength(5),
  helpers.regexOnlyNumbers,
]

export const definition = {
  type: `string`,
  description: [`ZIP code`, `- (must be exactly 5 digits)`],
  example: `12345`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
