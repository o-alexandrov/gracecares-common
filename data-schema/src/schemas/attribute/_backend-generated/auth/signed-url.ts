export const name = `signedUrl`

export const definition = {
  type: `string`,
  description: `Signed URL to get the file from S3`,
  example: `https://account.s3.eu-central-1.amazonaws.com/blurhash/askdfjasdfaudshfasjdfkda`,
} satisfies OA3.Attribute
