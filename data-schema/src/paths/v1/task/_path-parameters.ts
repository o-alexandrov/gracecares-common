import * as items from "@gracecares-ai/data-schema/src/schemas/item"

export const recipient = {
  userID: { variant: "network", name: `recipient` },
} satisfies OA3.PathParameters

export const created = {
  created: { variant: "seconds" },
} satisfies OA3.PathParameters
