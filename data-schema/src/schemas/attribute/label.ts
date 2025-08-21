import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `label`

export const regex = helpers.hasLengths(1, 200)

export const definition = {
  type: `string`,
  description: [`Label for the attribute`, `- (doesn't have to be unique)`],
  example: `Check in on symptoms and mood.`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
