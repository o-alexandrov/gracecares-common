import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `notes`

export const regex = helpers.hasLengths(0, 1000)

export const definition = {
  type: `string`,
  description: `Any additional comments or other information`,
  example: `Patient is allergic to penicillin.`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
