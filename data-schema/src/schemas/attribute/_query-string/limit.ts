import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `limit`

export const valueDefault = 10
const valueMaximum = 100

export const parseQs = helpers.setParseQueryStringValue({
  default: valueDefault,
  min: 1,
  max: valueMaximum,
})

export const definition = {
  type: `number`,
  format: `int32`,
  default: valueDefault,
  example: valueMaximum,
  description: [
    `Number of items per page.`,
    `- maximum is \`${valueMaximum}\` (but we won't throw an error, if you request more)`,
  ],
  /**
   * @IMPORTANT we don't want to set `maximum` here, because we don't want to throw a validation error
   */
} satisfies OA3.Attribute
