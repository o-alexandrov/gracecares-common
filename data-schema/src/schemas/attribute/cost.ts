import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `cost`

export const regex = helpers.hasLengths(1, 500)

export const definition = {
  type: `string`,
  description: [`Cost information and payment options`],
  example: `fee-based (private pay/insurance; call for rates)`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
