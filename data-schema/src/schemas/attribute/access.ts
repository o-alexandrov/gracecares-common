import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `access`

export const regex = helpers.hasLengths(1, 500)

export const definition = {
  type: `string`,
  description: [`How to access the resource or service`],
  example: `Call for a free consultation and to schedule services.`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
