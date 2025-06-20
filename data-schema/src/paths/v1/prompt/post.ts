import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Send data for a prompt`,
  // requestBody: {
  //   properties: {
  //     login: { required: true },
  //   },
  // },
  responses: {
    [StatusCodes.OK]: {},
  },
} as const satisfies OA3.Path
