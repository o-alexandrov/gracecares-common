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
        type: "object",
        _dangerousUndocumentedProperties: {
          resources: {
            required: true,
            description: `List of resources within the network`,
            type: "array",
            items: {
              type: "object",
              properties: items.resource.definition,
            },
          },
          careRecipient: {
            required: true,
            type: "object",
            description: `Information about the care recipient`,
            properties: items.user.publicData,
          },
        },
      },
    },
  },
} as const satisfies OA3.Path
