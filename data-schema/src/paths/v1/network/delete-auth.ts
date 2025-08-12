import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Delete all created networks by the Authenticated user`,
  responses: {
    [StatusCodes.NOT_FOUND]: {},
    [StatusCodes.OK]: {
      description: `All created networks by the Authenticated user have been deleted`,
    },
  },
} as const satisfies OA3.Path
