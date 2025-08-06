const variant = `network` satisfies OA3.VariantOptions

export const definition = {
  userID: {
    variant,
    required: true,
    descriptionAdditional: `This is a unique identifier. It's not a copy of another identifier. It's a completely independent identifier.`,
  },
  caregiverID: { required: true },
  created: {
    variant: `seconds`,
    required: true,
    descriptionAdditional: `When the network was created`,
  },
  updated: {
    variant: `seconds`,
    descriptionAdditional: `The last time the network was updated`,
  },
  confirmed: {
    variant: `network`,
    descriptionAdditional: `Indicator whether the network has been confirmed by the care recipient`,
    required: true,
  },
} as const satisfies OA3.Properties
