import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `conditionStartDate`

export const definition = {
  type: `string`,
  description: [`Condition start date`],
  example: `08/2022`,
  preprocess: `trim`,
} satisfies OA3.Attribute
