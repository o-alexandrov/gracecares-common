import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Create network`,
  requestBody: {
    properties: {
      phone: { required: true },
      relationship: { required: true },
      name: { required: true },
      namePreferred: {},
      address: {},
      notes: {},
    },
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {},
    [StatusCodes.BAD_REQUEST]: {
      description: `Caregiver and care recipient already have a network`,
    },
    [StatusCodes.OK]: {
      description: `Network created with a new user for care recipient`,
    },
    [StatusCodes.CREATED]: {
      description: `Network created without a new user for care recipient`,
    },
  },
} as const satisfies OA3.Path
