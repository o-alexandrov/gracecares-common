import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `msg`

export const regex = helpers.hasLengths(0, 1000)

export const definition = {
  type: `string`,
  description: `Message content`,
  example: `Can you prepare the report by tomorrow?`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
