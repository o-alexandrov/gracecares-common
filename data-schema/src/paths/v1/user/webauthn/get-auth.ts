import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Generate WebAuthn challenge for user authentication or registration`,
  pathParameters: {
    token: {},
  },
  responses: {
    [StatusCodes.NOT_FOUND]: {
      description: `Invalid token`,
    },

    [StatusCodes.OK]: {
      description: `WebAuthn challenge generated successfully`,
      schema: {
        oneOf: [
          {
            title: `For users with existing passkeys`,
            type: `object`,
            properties: {},
            _dangerousUndocumentedProperties: {
              challenge: {
                required: true,
                type: `string`,
                description: `Base64url-encoded cryptographically secure random challenge (32 bytes)`,
                example: `Y2hhbGxlbmdlXzEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eg`,
              },
              allowCredentials: {
                required: true,
                type: `array`,
                description: `List of allowed credentials for authentication`,
                items: {
                  type: `object`,
                  _dangerousUndocumentedProperties: {
                    id: {
                      required: true,
                      type: `string`,
                      description: `WebAuthn credential ID`,
                      example: `CaSKxtuWeiIWvSPu3lUZlxueNKw`,
                    },
                    type: {
                      required: true,
                      type: `string`,
                      enum: [`public-key`],
                      description: `Credential type`,
                    },
                  },
                },
              },
            },
          },
          {
            title: `For users without existing passkeys`,
            type: `object`,
            properties: {},
            _dangerousUndocumentedProperties: {
              challenge: {
                required: true,
                type: `string`,
                description: `Base64url-encoded cryptographically secure random challenge (32 bytes)`,
                example: `Y2hhbGxlbmdlXzEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eg`,
              },
              user: {
                required: true,
                type: `object`,
                description: `User information for registration`,
                _dangerousUndocumentedProperties: {
                  id: {
                    required: true,
                    type: `string`,
                    description: `Base64url-encoded user ID`,
                    example: `dXNlcl8xMjM0NTY3ODkw`,
                  },
                  name: {
                    required: true,
                    type: `string`,
                    description: `User's email, phone, or username for display`,
                    example: `user@example.com`,
                  },
                  displayName: {
                    required: true,
                    type: `string`,
                    description: `User's preferred display name`,
                    example: `John Doe`,
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
} as const satisfies OA3.Path
