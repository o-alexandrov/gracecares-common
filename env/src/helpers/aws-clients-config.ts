import type { AwsCredentialIdentity } from "@aws-sdk/types"

const credentialsToAWS = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
} satisfies AwsCredentialIdentity

const credentialsRemoteOrLocal = process.env.TEST
  ? ({
      accessKeyId: `dummy`,
      secretAccessKey: `dummy`,
    } satisfies AwsCredentialIdentity)
  : credentialsToAWS

const common = {
  region: process.env.AWS_REGION,
} as const

export const awsClientsConfig = {
  ...common,
  credentials: credentialsRemoteOrLocal,
  cacheMiddleware: true, // see: https://github.com/aws/aws-sdk-js-v3/issues/6423
}

/**
 * Configuration to always use remote (real) AWS services (not emulated locally)
 *   - we want to test some services locally (ex. DynamoDB) but less frequently used (or error-prone locally) (ex. S3) always remotely
 */
export const awsClientsConfigAlwaysRemote = {
  ...common,
  credentials: credentialsToAWS,
}
