import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Validate and register a new WebAuthn credential for the user`,
  requestBody: {
    properties: {
      webauthnRegistration: { required: true },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      description: `WebAuthn credential registered successfully`,
    },
  },
} as const satisfies OA3.Path
