import * as StatusCodes from "http-status-codes"

import * as pathParameters from "../../_path-parameters"

const patchableAttributes = {
  healthCondition: {},
  careNeeds: {},
  expectation: {},
  conditionStartDate: {},
} as const satisfies OA3.Properties<true>

export const definition = {
  summary: `Update network`,
  pathParameters: {
    ...pathParameters.recipient,
    ...pathParameters.created,
  },
  requestBody: {
    properties: patchableAttributes,
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {},
    [StatusCodes.OK]: {
      description: `Network updated`,
    },
  },
} as const satisfies OA3.Path
