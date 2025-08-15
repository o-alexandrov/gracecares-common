import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `healthCondition`

export const regex = helpers.hasLengths(1, 1000)

export const definition = {
  type: `string`,
  description: `Health condition description`,
  example: `Diabetes`,
  regex,
  preprocess: "trim",
} satisfies OA3.Attribute
