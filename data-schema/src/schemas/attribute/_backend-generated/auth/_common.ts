export const description = [
  `Authentication information to upload a file to AWS S3, includes:`,
  `- policy`,
  `- signature`,
] as const satisfies OA3.Description

export const _dangerousUndocumentedProperties = {
  policy: {
    required: true,
    type: `string`,
    readOnly: true,
    description: `Base64 encoded policy`,
    example: `eNo1zgEAAE8B`,
    externalDocs: {
      description: `Refer to \`policy\` in AWS docs`,
      url: `https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-authentication-HTTPPOST.html`,
    },
  },
  signature: {
    required: true,
    type: `string`,
    readOnly: true,
    description: `Base64 encoded signature`,
    example: `eNo1zgEAAE8B`,
    externalDocs: {
      description: `Refer to \`x-amz-signature\` in AWS docs`,
      url: `https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-authentication-HTTPPOST.html`,
    },
  },
} as const satisfies OA3.Object[`_dangerousUndocumentedProperties`]
