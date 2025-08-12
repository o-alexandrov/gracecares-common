import * as StatusCodes from "http-status-codes"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as items from "@gracecares-ai/data-schema/src/schemas/item"

const commonSchema = {
  type: "object",
  properties: {
    ...commonHelpers.pick(items.network.definition, ["userID", "created"]),
  },
} as const satisfies OA3.ResponseSchema

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
      description: `New network created (care recipient is invited as an existing user)`,
      schema: commonSchema,
    },
    [StatusCodes.CREATED]: {
      description: `New network created AND a new user (care recipient)`,
      schema: commonSchema,
    },
  },
} as const satisfies OA3.Path
