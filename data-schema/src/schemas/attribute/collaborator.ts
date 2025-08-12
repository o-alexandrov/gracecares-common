export const name = `collaborator`

export const definition = {
  type: `object`,
  description: `Any additional information`,
  properties: {
    userID: { variant: `generic`, required: true },
    notes: {
      descriptionAdditional: `Notes about the collaborator`,
    },
    confirmed: { variant: "network", required: true },
  },
} satisfies OA3.Attribute
