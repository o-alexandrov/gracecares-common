import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `relationship`

export const regex = helpers.hasLengths(0, 200)

export const definition = {
  type: `string`,
  description: `Relationship to the user`,
  example: `Mother`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
