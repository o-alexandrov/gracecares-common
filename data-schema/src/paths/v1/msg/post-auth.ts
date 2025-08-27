import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Send an SMS with directions`,
  requestBody: {
    properties: {
      ...commonHelpers.pick(items.task.definition, ["id"]),
      ...commonHelpers.pick(items.network.definition, ["userID", "created"]),
    },
  },
  responses: {
    [StatusCodes.OK]: {},
  },
} as const satisfies OA3.Path
