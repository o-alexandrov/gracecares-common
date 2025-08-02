export const name = `phone`

export const regex: DataSchema.ValidationRegExp[] = [
  {
    msg: `Must be a valid 10-digit phone number (e.g., 4155552671)`,
    exp: /^\d{10}$/,
  },
]

export const definition = {
  type: `string`,
  description: [
    `Phone number`,
    `- must be a 10-digit number (e.g., 4155552671)`,
  ],
  example: `4155552671`,
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
