const variant = `resource` satisfies OA3.VariantOptions

export const definition = {
  id: {
    required: true,
    descriptionAdditional: `Unique identifier within the network`,
  },
  created: { variant: `seconds`, required: true },
  updated: { variant: `seconds` },
  organization: { required: true },
  description: { required: true },
  category: { variant, required: true },
  access: {},
  contact: {},
  cost: {},
  conditionValue: {},
  eligibility: {},
} as const satisfies OA3.Properties
