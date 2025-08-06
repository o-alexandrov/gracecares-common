export const name = `confirmed`

export const variants = {
  generic: {
    type: `number`,
    enum: [1],
    description: `Indicator whether a user has confirmed a specific action where this attribute is used`,
  },
  network: {
    type: `number`,
    enum: [0, 1],
    description: `Indicator whether a care recipient has confirmed a network with a caregiver`,
  },
} as const satisfies OA3.Variants
