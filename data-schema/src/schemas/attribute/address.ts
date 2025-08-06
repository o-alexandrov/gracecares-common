import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `address`

export const regex = helpers.hasLengths(0, 500)

export const definition = {
  type: `string`,
  description: `Street address`,
  example: `123 Main St, Springfield, IL 62701`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
