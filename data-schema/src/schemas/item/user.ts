const variant = `user` satisfies OA3.VariantOptions

export const publicData = {
  id: { required: true },
  created: { variant: `seconds`, required: true },
  username: { required: true },

  name: {},
} as const satisfies OA3.Properties

export type PublicDataKeys = keyof typeof publicData

const privateData = {
  email: {},
  noP: {},
  ttl: {
    variant: `hours`,
    descriptionAdditional: [
      `Represents when the user will be automatically removed.\n`,
      `A user can request account & data removal`,
      `- when we receive such request, our backend adds \`ttl\` attribute for automated removal a week later`,
    ],
  },
} as const satisfies OA3.Properties

const privateSystemData = {
  notifications: {},
} as const satisfies OA3.Properties

export const definition = {
  ...publicData,
  ...privateData,
  ...privateSystemData,
}

export type PrivateDataKeys = Exclude<keyof typeof definition, PublicDataKeys>
