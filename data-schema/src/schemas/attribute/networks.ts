export const name = `networks`

export const definition = {
  type: `array`,
  description: `List of networks identifiers`,
  items: {
    type: `string`,
  },
} satisfies OA3.Attribute
