import * as StatusCodes from "http-status-codes"
import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"

import * as pathParameters from "../../_path-parameters"

export const definition = {
  summary: `Get all resources within a network`,
  pathParameters: {
    ...pathParameters.recipient,
    ...pathParameters.created,
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {},

    [StatusCodes.OK]: {
      description: `Resources within the network`,
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: items.resource.definition,
        },
      },
    },
  },
} as const satisfies OA3.Path
