export const name = `collaborator`

export const definition = {
  type: `object`,
  description: `Any additional information`,
  properties: {
    id: {
      required: true,
      descriptionAdditional: `The user's ID from \`user\` table`,
    },
    notes: {
      descriptionAdditional: `Notes about the collaborator`,
    },
    confirmed: { variant: "network", required: true },
  },
} satisfies OA3.Attribute
