import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Verification Step1. Request a code`,
  requestBody: {
    properties: {
      phone: { required: true },
    },
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {},
    [StatusCodes.BAD_REQUEST]: {
      description: `User already exists`,
    },
    [StatusCodes.CONFLICT]: {
      description: `Too many requests`,
    },
    [StatusCodes.EXPECTATION_FAILED]: {
      description: `User's confirmed email/phone is the same as in the request`,
    },
    [StatusCodes.FAILED_DEPENDENCY]: {
      description: `This shouldn't happen. Email/sms couldn't be sent`,
    },
    [StatusCodes.OK]: {
      description: `Email/sms with a code is sent`,
    },
  },
} as const satisfies OA3.Path
