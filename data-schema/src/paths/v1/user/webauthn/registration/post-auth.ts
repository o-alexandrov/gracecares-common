import * as item from "@gracecares-ai/data-schema/src/schemas/item"
import * as StatusCodes from "http-status-codes"
export const definition = {
  summary: `Validate a new WebAuthn credentials for the user and store it in the database`,
  requestBody: {
    properties: {
      webauthnRegistration: { required: true },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      description: `WebAuthn credential registered successfully`,
      schema: {
        type: `object`,
        _dangerousUndocumentedProperties: {
          user: {
            required: true,
            type: `object`,
            description: `User data, with private data included`,
            properties: item.user.definition,
          },
        },
      },
    },
  },
} as const satisfies OA3.Path
