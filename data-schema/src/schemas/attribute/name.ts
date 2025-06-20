import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `name`

export const regex = helpers.hasLengths(1, 50) // same max limit as Twitter

export const definition = {
  type: `string`,
  description: [`Display name`, `- (doesn't have to be unique)`],
  example: `John Snow`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
