import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `namePreferred`

export const regex = helpers.hasLengths(0, 200)

export const definition = {
  type: `string`,
  description: [`Preferred name (nickname)`, `- (doesn't have to be unique)`],
  example: `John Snow`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
