import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `careNeeds`

export const regex = helpers.hasLengths(1, 200)

export const definition = {
  type: `array`,
  description: `List of care needs`,
  items: {
    type: "string",
    regex,
    preprocess: "trimAndLowerCase",
  },
} satisfies OA3.Attribute
