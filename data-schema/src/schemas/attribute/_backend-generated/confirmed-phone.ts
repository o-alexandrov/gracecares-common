export const name = `confirmedPhone`

export const definition = {
  type: `number`,
  enum: [1],
  description: `Indicator whether a user has confirmed their phone number`,
} satisfies OA3.Attribute
