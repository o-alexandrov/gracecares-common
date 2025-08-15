import * as StatusCodes from "http-status-codes"
import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"

import * as pathParameters from "../../../_path-parameters"

const commonSchema = {
  type: "object",
  _dangerousUndocumentedProperties: {
    collaborator: {
      type: "object",
      required: true,
      description: "Collaborator user's data",
      properties: items.user.publicData,
    },
  },
} as const satisfies OA3.ResponseSchema

export const definition = {
  summary: `Add collaborator to network`,
  pathParameters: {
    ...pathParameters.recipient,
    ...pathParameters.created,
  },
  requestBody: {
    properties: {
      name: { required: true },
      phone: { required: true },
      notes: {},
    },
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {},
    [StatusCodes.OK]: {
      description: `Existing user is added to the network`,
      schema: commonSchema,
    },
    [StatusCodes.CREATED]: {
      description: `A new user is created and added to the network`,
      schema: commonSchema,
    },
  },
} as const satisfies OA3.Path
