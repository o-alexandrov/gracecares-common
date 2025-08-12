import * as StatusCodes from "http-status-codes"

import * as pathParameters from "../../../_path-parameters"

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
    },
    [StatusCodes.CREATED]: {
      description: `A new user is created and added to the network`,
    },
  },
} as const satisfies OA3.Path
