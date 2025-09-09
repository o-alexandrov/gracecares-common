import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Send data for a prompt`,
  requestBody: {
    properties: {
      ...commonHelpers.pick(items.network.definition, ["userID", "created"]),
      id: {
        descriptionAdditional: [
          `Identifier of the uploaded document`,
          `- user can skip uploading a document (so it's optional)`,
        ],
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      schema: {
        type: `object`,
        properties: {
          id: {
            required: true,
            descriptionAdditional: [`Identifier of a thread`],
          },
        },
        _dangerousUndocumentedProperties: {
          runId: {
            required: true,
            type: `string`,
            description: `Identifier of the prompt run`,
            example: `run_1234567890abcdef`,
          },
          assistantId: {
            required: true,
            type: `string`,
            description: `Identifier of the assistant`,
            example: `asst_1234567890abcdef`,
          },
          fileId: {
            type: `string`,
            description: `Identifier of the uploaded file (if any)`,
            example: `file_1234567890abcdef`,
          },
        },
      },
    },
  },
} as const satisfies OA3.Path
