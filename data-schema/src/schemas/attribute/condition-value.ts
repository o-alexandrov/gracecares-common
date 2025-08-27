import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `conditionValue`

export const regex = helpers.hasLengths(1, 1000)

export const definition = {
  type: `string`,
  description: [`Value or benefit for specific health conditions`],
  example: `Bridges daily needs during hip surgery recovery and provides routine support for diabetes and early dementia at home.`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
