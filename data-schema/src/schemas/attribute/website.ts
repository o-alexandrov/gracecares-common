import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `website`

export const regex = helpers.hasLengths(1, 500)

export const definition = {
  type: `string`,
  description: [`Website URL`],
  example: `https://www.attentionplus.com/`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
