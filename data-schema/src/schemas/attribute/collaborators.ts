export const name = `collaborators`

export const definition = {
  type: `array`,
  description: `List of collaborators`,
  items: {
    $ref: `#/components/schemas/collaborator`,
  },
} satisfies OA3.Attribute
