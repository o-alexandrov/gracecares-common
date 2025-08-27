import * as StatusCodes from "http-status-codes"
import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"

import * as pathParameters from "../../_path-parameters"

export const definition = {
  summary: `Get all tasks within a network`,
  pathParameters: {
    ...pathParameters.recipient,
    ...pathParameters.created,
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {},

    [StatusCodes.OK]: {
      description: `Tasks within the network`,
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: items.task.definition,
          _dangerousUndocumentedProperties: {
            assignee: {
              required: true,
              type: "object",
              description: "The user assigned to the task",
              properties: items.user.publicData,
            },
          },
        },
      },
    },
  },
} as const satisfies OA3.Path
