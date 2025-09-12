// Common properties shared between WebAuthn registration and authentication responses

export const credentialId = {
  required: true,
  type: `string`,
  description: `Base64URL-encoded credential ID`,
  example: `"CaSKxtuWeiIWvSPu3lUZlxueNKw"`,
} as const

export const credentialRawId = {
  required: true,
  type: `string`,
  description: `Base64URL-encoded raw credential ID (same as id)`,
  example: `"CaSKxtuWeiIWvSPu3lUZlxueNKw"`,
} as const

export const credentialType = {
  required: true,
  type: `string`,
  enum: [`public-key`],
  description: `Credential type - always "public-key" for WebAuthn`,
} as const

export const clientExtensionResults = {
  type: `object`,
  description: `Results of any WebAuthn extensions that were processed`,
  _dangerousUndocumentedProperties: {},
} as const

export const authenticatorAttachment = {
  type: `string`,
  enum: [`platform`, `cross-platform`],
  description: `How the authenticator is attached to the client device`,
} as const

export const clientDataJSON = {
  required: true,
  type: `string`,
  description: `Base64URL-encoded client data JSON`,
  example: `eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiWTJoaGJHeGxibWRsWHpFeU16UTFOVE0zT0RrdGJXTmtaV1puYUdsYWEyeHRibTl3Y1hKemRIVjJkM2g1ZWciLCJvcmlnaW4iOiJodHRwczovL2V4YW1wbGUuY29tIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ`,
} as const

export const authenticatorData = {
  type: `string`,
  description: `Base64URL-encoded authenticator data`,
  example: `eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiWTJoaGJHeGxibWRsWHpFeU16UTFOVE0zT0RrdGJXTmtaV1puYUdsYWEyeHRibTl3Y1hKemRIVjJkM2g1ZWciLCJvcmlnaW4iOiJodHRwczovL2V4YW1wbGUuY29tIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ`,
} as const
