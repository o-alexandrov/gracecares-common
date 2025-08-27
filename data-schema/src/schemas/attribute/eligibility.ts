import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `eligibility`

export const regex = helpers.hasLengths(0, 500)

export const definition = {
  type: `string`,
  description: [`Eligibility requirements for the resource or service`],
  example: `None stated`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
