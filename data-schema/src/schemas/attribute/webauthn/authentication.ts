import * as common from "./_common"

export const name = `webauthnAuthentication`

export const definition = {
  type: `object`,
  description: `Response from WebAuthn authentication (startAuthentication) containing the credential information and assertion data. We use library @simplewebauthn/browser`,
  _dangerousUndocumentedProperties: {
    id: common.credentialId,
    rawId: common.credentialRawId,
    response: {
      required: true,
      type: `object`,
      description: `Authenticator assertion response`,
      _dangerousUndocumentedProperties: {
        authenticatorData: {
          required: true,
          ...common.authenticatorData,
        },
        clientDataJSON: common.clientDataJSON,

        signature: {
          required: true,
          type: `string`,
          description: `Base64URL-encoded signature over the authenticator data and client data hash`,
          example: `MEYCIQC0zhs0Ju68En-FgM-IBwJoodWubL7Qn3pvozn3RvglaQIhANzCH7fw0wF998rsnKjNf9q0oXC-nFNdVq761xnGeEGV`,
        },
        userHandle: {
          required: true,
          type: `string`,
          description: `Base64URL-encoded user handle (user ID) - may be null for some authenticators`,
          example: `Q0MyU1IyOGZnMW1zT3NfbGZ3ZTJi`,
        },
      },
    },
    type: common.credentialType,
    clientExtensionResults: common.clientExtensionResults,
    authenticatorAttachment: common.authenticatorAttachment,
  },
} satisfies OA3.Attribute
