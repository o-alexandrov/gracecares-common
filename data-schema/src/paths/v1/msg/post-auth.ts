import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Send an SMS with directions`,
  requestBody: {
    _dangerousUndocumentedProperties: {
      threadId: {
        type: `string`,
        description: `Thread ID for the conversation, if applicable`,
        example: `thread_1234567890`,
        required: true,
      },
      phoneNumber: {
        type: `string`,
        description: `Phone number to send the SMS to`,
        example: `+1234567890`,
        required: true,
      },
      message: {
        type: `string`,
        description: `Message to send in the SMS`,
        example: `Please follow these directions to the clinic.`,
        required: true,
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {},
  },
} as const satisfies OA3.Path
