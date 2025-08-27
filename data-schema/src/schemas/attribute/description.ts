import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `description`

export const regex = helpers.hasLengths(1, 1000)

export const definition = {
  type: `string`,
  description: [`Description of the resource or service`],
  example: `Private-duty home health and personal care (bathing, meals, medication reminders, transportation) by a licensed agency.`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
