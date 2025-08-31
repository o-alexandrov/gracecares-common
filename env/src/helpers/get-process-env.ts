/**
 * @WARNING must not import any values
 *   - needs to be pure, as otherwise those modules would be loaded before env values would be set
 */
import { fromIni } from "@aws-sdk/credential-provider-ini"
import type { AwsCredentialIdentity } from "@aws-sdk/types"
import * as commonHelpers from "@gracecares-ai/helpers"
import type * as TF from "type-fest"
import * as fs from "node:fs"
import * as path from "node:path"

import { getDomain } from "./consts"
import { AWSEnvVars, getAwsVars } from "./get-aws-vars"
import { getLocalIpAddress } from "./get-local-ip-address"

/**
 * Finds the root path of the repo by looking for the nearest package.json with "workspaces" attribute
 * @returns The root path of the repo or undefined if not found
 */
const findRepoRootPath = async (
  startPath: string = process.cwd(),
): Promise<string> => {
  let currentPath = path.resolve(startPath)

  while (currentPath !== path.dirname(currentPath)) {
    // Stop when we reach the filesystem root
    const packageJsonPath = path.join(currentPath, "package.json")

    try {
      if (fs.existsSync(packageJsonPath)) {
        const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8")
        const packageJson = JSON.parse(packageJsonContent)

        if (packageJson.workspaces) {
          return currentPath
        }
      }
    } catch (error) {
      // Continue searching if we can't read or parse the package.json
    }

    // Move up one directory
    currentPath = path.dirname(currentPath)
  }

  throw new Error(`No package.json with "workspaces" found`)
}

type variants = TF.MergeExclusive<
  {
    web: true
  },
  {
    /**
     * Adds "AWS_ACCESS_KEY_ID" & "AWS_SECRET_ACCESS_KEY" to the process.env based on what you have in your "~/.aws/credentials" file
     */
    addAWSCredentials: boolean
    /**
     * Absolute path to the secrets `env.ts` file
     *
     * If you have secret values in a project, make sure you have two files:
     *   - `env.ts` - git ignore this file
     *   - `env.example.ts` - include this file in git history
     *
     * Both files must export `env` object with the same keys
     *
     * @example how to set `pathToSecrets`
     * {
     *     // other props
     *     pathToSecrets: `~/repo/env.ts`,
     * }
     * 
     * @example content of `env.example.ts`
     *   - this would result in `process.env.MY_SECRET_VALUE` being set
     * 
export const env = {
  MY_SECRET_VALUE: ``,
} satisfies Record<Uppercase<string>, string>

export type Env = typeof env
     */
    pathToSecrets?: string
  }
>

export type EnvProps = variants & {
  test?: boolean
  docker?: boolean
  nodeEnv?: `development`
  awsVars?: AWSEnvVars
  extraVars?: Record<string, string | undefined>
}

const isCDD = process.env.CDD as `1` | false
const isCDDForComponents = (isCDD && process.env.CDD_COMPONENTS) as `1` | false
const isRunningUtils = process.env.UTILS as `1` | false
const isMobileAppiOS = process.env.iOS as `1` | false
const isMobileAppAndroid = process.env.ANDROID as `1` | false
const isMobileApp = isMobileAppAndroid || isMobileAppiOS
const isNativeApp = isMobileApp

const processValue = (value: string | boolean | undefined) =>
  !value ? `` : `true`

export const getProcessEnv = async (props: EnvProps) => {
  const awsVars = props.awsVars || (await getAwsVars())
  const creds = (props.addAWSCredentials &&
    (await fromIni({ profile: awsVars.profile })().catch(() => {
      console.warn(
        `AWS credentials not found. Ignore if you don't need/use them.`,
      )
    }))) as AwsCredentialIdentity | undefined // otherwise type inference fails for process.env

  const values = {
    /**
     * Common
     */
    NODE_ENV: props.nodeEnv || `production`,
    /**
     * Whether the process is running in test mode
     */
    TEST: processValue(props.test),
    NODE_DEBUG: ``,
    AWS_REGION: awsVars.region,
    AWS_PROFILE: awsVars.profile,
    AWS_STAGE: awsVars.stage,
    AWS_ACCOUNT_ID: awsVars.accountId,
    ...(creds && {
      AWS_ACCESS_KEY_ID: creds.accessKeyId,
      AWS_SECRET_ACCESS_KEY: creds.secretAccessKey,
    }),
    /**
     * Project-specific variables
     */
    /**
     * When accessing the local backend from an external device, using "localhost" won't work.
     * The local IP address must be used instead.
     */
    LOCALHOST: (!(process.env as any).CI && getLocalIpAddress()) as string,
    /**
     * Whether the process is running in docker
     */
    DOCKER: processValue(props.docker),
    DOMAIN: getDomain(awsVars.stage),
    /**
     * Running in a web environment (NOT in server-side rendering environment)
     * Web environment is:
     *   - browser
     *   - mobile app (also runs in a browser; the native app opens our website)
     *   - desktop app (also runs in a browser; the native app opens our website)
     */
    WEB: processValue(props.web),
    /**
     * Running in a Component Driven Development environment (in isolation, ex. COMPONENT.stories.tsx)
     */
    CDD: processValue(isCDD),
    /**
     * Running in a Component Driven Development environment
     *   - for components ONLY, not views
     */
    CDD_COMPONENTS: processValue(isCDDForComponents),
    /**
     * Running in a mobile environment (iOS, Android)
     */
    MOBILE: processValue(isMobileApp),
    iOS: processValue(isMobileApp && isMobileAppiOS),
    ANDROID: processValue(isMobileApp && isMobileAppAndroid),
    /**
     * Running in a native environment (Electron, iOS, Android)
     */
    NATIVE_APP: processValue(isNativeApp),
    UTILS: processValue(isRunningUtils),
    /**
     * Expect the process to have an error (used in testing)
     */
    EXPECT_ERROR: processValue(undefined),
    /**
     * Show analysis of the build or running process
     */
    ANALYZE: processValue(undefined),
    /**
     * List AWS resources, if imported
     */
    LIST: processValue(undefined),

    ...props.extraVars,
  } as const satisfies Record<string, string>

  const hasEnvironmentSecrets = process.env.HAS_ENV_SECRETS
  if (hasEnvironmentSecrets) {
    const pathRepoRoot = await findRepoRootPath()
    const pathEnv = path.join(pathRepoRoot, `env.ts`)
    const pathExampleEnv = path.join(pathRepoRoot, `env.example.ts`)
    const pathToSecrets = process.env.CI ? pathExampleEnv : pathEnv

    if (!process.env.CI) {
      const [isEnvExists, isExampleEnvExists] = await Promise.all([
        commonHelpers.checkExists(pathEnv),
        commonHelpers.checkExists(pathExampleEnv),
      ])
      if (!isEnvExists) {
        throw new Error(
          `Create "${pathEnv}" file\nIt should export "env" object with all the keys from "${pathExampleEnv}"`,
        )
      }
      if (!isExampleEnvExists) {
        throw new Error(
          `Create ${pathExampleEnv} file and export "env" object with key/value pairs of your secrets`,
        )
      }
    }

    const secrets = await import(pathToSecrets).then((m) => m.env) // resolve `env` variable's value from the file
    for (const key of Object.keys(secrets)) {
      if (values[key]) {
        throw new Error(
          `Secret "${key}" must NOT override a value declared in "envHelpers.getProcessEnv"`,
        )
      }

      values[key] = process.env.CI ? process.env[key] : secrets[key]
      if (!values[key]) {
        const errorMsg = process.env.CI
          ? `Add "${key}" to GitHub Secrets`
          : `Set "${key}" in "env.ts"`
        throw new Error(`Secret "${key}" is missing\n${errorMsg}`)
      }
    }
  }

  return values
}

export type NodeJSProcessEnv = TF.Except<
  Awaited<ReturnType<typeof getProcessEnv>>,
  `EXPECT_ERROR`
> & {
  EXPECT_ERROR?: true
}
export type ProcessEnvCustomKeys = keyof NodeJSProcessEnv
