import * as common from "./_common"

export const name = `webauthnRegistration`

export const definition = {
  type: `object`,
  description: `Response from "startRegistration" containing the credential information and attestation data. We use library @simplewebauthn/browser`,
  _dangerousUndocumentedProperties: {
    id: common.credentialId,

    rawId: common.credentialRawId,
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
        clientDataJSON: common.clientDataJSON,
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
        authenticatorData: common.authenticatorData,
      },
    },
    type: common.credentialType,
    clientExtensionResults: common.clientExtensionResults,
    authenticatorAttachment: common.authenticatorAttachment,
  },
} satisfies OA3.Attribute
