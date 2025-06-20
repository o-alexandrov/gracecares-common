export const name = `page`

export const separator = `,`

export const definition = {
  type: `string`,
  description: [
    `Directions (cursor) for the backend to select the next page data.`,
    `- in other words, this attribute serves for pagination`,
    `- the values are separated by \`${separator}\``,
  ],
  example: `VALUE_1${separator}VALUE_2`,
} satisfies OA3.Attribute
