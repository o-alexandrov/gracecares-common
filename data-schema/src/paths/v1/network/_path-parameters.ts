export const recipient = {
  userID: { variant: `generic`, name: `recipient` },
} satisfies OA3.PathParameters

export const created = {
  created: { variant: "seconds" },
} satisfies OA3.PathParameters
