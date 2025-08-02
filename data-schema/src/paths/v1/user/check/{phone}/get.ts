import * as StatusCodes from "http-status-codes"

import * as pathParameters from "../../_path-parameters"

export const definition = {
  summary: `Check whether user exists`,
  pathParameters: pathParameters.phone,
  queryParameters: {
    create: {},
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {},

    [StatusCodes.OK]: {
      description: `User with such \`phone\` exists`,
    },
  },
} as const satisfies OA3.Path
