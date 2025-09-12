import * as item from "@gracecares-ai/data-schema/src/schemas/item"
import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Validate an existing WebAuthn credentials for the user and authenticate user `,
  requestBody: {
    properties: {
      webauthnAuthentication: { required: true },
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
