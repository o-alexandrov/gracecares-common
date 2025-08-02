import * as attr from "@gracecares-ai/data-schema/src/schemas/attribute"
import * as item from "@gracecares-ai/data-schema/src/schemas/item"
import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Verification Step2. Confirm verification code`,
  requestBody: {
    properties: {
      phone: { required: true },
      codeV: { required: true },
    },
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {},
    [StatusCodes.CONFLICT]: {
      description: `Invalid \`${attr.codeV.name}\``,
    },
    [StatusCodes.BAD_REQUEST]: {
      description: `User doesn't have an \`email\`/\`phone\` to confirm`,
    },
    [StatusCodes.EXPECTATION_FAILED]: {
      description: `User with such \`email\`/\`phone\` already exists`,
    },
    [StatusCodes.OK]: {
      description: `User verified \`email\`/\`phone\``,
      schema: {
        type: `object`,
        properties: {
          token: { required: true },
        },
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
