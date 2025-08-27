import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `organization`

export const regex = helpers.hasLengths(1, 300)

export const definition = {
  type: `string`,
  description: [`Organization name or business name`],
  example: `Attention Plus Care (Licensed Home Care)`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
