import * as StatusCodes from "http-status-codes"

const patchableAttributes = {
  name: {},
  namePreferred: {},
  // password: {},
  // passwordNew: {},
  // notifications: { removable: true, immutable: true },
  // ttl: { variant: `add`, removable: true },
} as const satisfies OA3.Properties<true>

export const definition = {
  summary: `Update user from Authorization header`,
  requestBody: {
    properties: patchableAttributes,
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {},
    [StatusCodes.BAD_REQUEST]: {
      description: `Invalid password`,
    },
    [StatusCodes.OK]: {
      description: `User updated`,
    },
  },
} as const satisfies OA3.Path
