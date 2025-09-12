export const name = `webauthnRegistration`

export const definition = {
  type: `object`,
  description: `WebAuthn registration response containing the credential information and attestation data`,
  properties: {},
  _dangerousUndocumentedProperties: {
    id: {
      required: true,
      type: `string`,
      description: `Base64URL-encoded credential ID`,
      example: `Iohotm_S0sy1ioL2Gt2kOQ8l8ds`,
    },
    rawId: {
      required: true,
      type: `string`,
      description: `Base64URL-encoded raw credential ID (same as id)`,
      example: `Iohotm_S0sy1ioL2Gt2kOQ8l8ds`,
    },
    response: {
      required: true,
      type: `object`,
      description: `Authenticator attestation response`,
      _dangerousUndocumentedProperties: {
        attestationObject: {
          required: true,
          type: `string`,
          description: `Base64URL-encoded attestation object containing authenticator data and attestation statement`,
          example: `o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVikSZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAALraVWanqkAfvZZFYZpVBAEAINKaIbZvktLMsS4i9hrdhDoMJdOyUYB4OgWn4PmRLy2lpQECAyYgASFYIJxWAT5Hv1M5kOXl8YFT5Gqrj5rk9nD8dEemdqLsKwsZIlggDQhZKOh7KJm3vWFJcQ9C2kXK2eAE_2dJHGGdHGlAjyk`,
        },
        clientDataJSON: {
          required: true,
          type: `string`,
          description: `Base64URL-encoded client data JSON`,
          example: `eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiWTJoaGJHeGxibWRsWHpFeU16UTFOVE0zT0RrdGJXTmtaV1puYUdsYWEyeHRibTl3Y1hKemRIVjJkM2g1ZWciLCJvcmlnaW4iOiJodHRwczovL2V4YW1wbGUuY29tIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ`,
        },
        transports: {
          type: `array`,
          items: {
            type: `string`,
            enum: [`usb`, `nfc`, `ble`, `hybrid`, `internal`],
          },
          description: `List of transport methods supported by the authenticator`,
          example: [`hybrid`, `internal`],
        },
        publicKeyAlgorithm: {
          type: `number`,
          description: `COSE algorithm identifier for the credential public key`,
          example: -7,
        },
        publicKey: {
          type: `string`,
          description: `Raw public key (deprecated - use attestationObject instead)`,
          example: `pAECAyYgASFYIJxWAT5Hv1M5kOXl8YFT5Gqrj5rk9nD8dEemdqLsKwsZIlggDQhZKOh7KJm3vWFJcQ9C2kXK2eAE_2dJHGGdHGlAjyk`,
        },
        authenticatorData: {
          type: `string`,
          description: `Base64URL-encoded authenticator data`,
          example: `SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAALraVWanqkAfvZZFYZpVBAEA`,
        },
      },
    },
    type: {
      required: true,
      type: `string`,
      enum: [`public-key`],
      description: `Credential type - always "public-key" for WebAuthn`,
    },
    clientExtensionResults: {
      type: `object`,
      description: `Results of any WebAuthn extensions that were processed`,
      _dangerousUndocumentedProperties: {},
    },
    authenticatorAttachment: {
      type: `string`,
      enum: [`platform`, `cross-platform`],
      description: `How the authenticator is attached to the client`,
    },
  },
} satisfies OA3.Attribute
