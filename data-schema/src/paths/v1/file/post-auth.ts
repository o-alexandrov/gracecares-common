import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Request presigned URL for clinical document upload`,
  responses: {
    [StatusCodes.OK]: {
      schema: {
        type: `object`,
        properties: {
          id: { required: true },
          authFile: { required: true },
        },
      },
    },
  },
} as const satisfies OA3.Path
