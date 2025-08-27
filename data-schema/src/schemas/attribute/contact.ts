export const name = `contact`

export const definition = {
  type: `object`,
  description: [`Contact information`],
  properties: {
    phone: {},
    website: {},
  },
} satisfies OA3.Attribute
