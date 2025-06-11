import * as envHelpers from "@gracecares-ai/env/src/helpers"
import type { ViteUserConfig } from "vitest/config"
import { defineConfig } from "vitest/config"

export interface getConfigProps {
  env?: envHelpers.EnvProps
}

export const getConfig = async (props: getConfigProps = {}) => {
  const define = await envHelpers.getProcessEnvForBundling({
    addAWSCredentials: true,
    test: true,
    nodeEnv: `development`,
    ...props.env,
  } as envHelpers.EnvProps)

  return {
    define,
    test: {
      testTimeout: 60000 /** @see https://vitest.dev/config/#testtimeout */,
      hookTimeout: 40000 /** ex. beforeAll @see https://vitest.dev/config/#hooktimeout */,

      sequence: {
        concurrent: true,
      },
      globals: true,
      passWithNoTests: true,
      include: [`**/*.{test,spec}.?(c|m)[jt]s?(x)`],

      /**
       * By setting `isolate` to `false`, unit tests become integration tests in some cases.
       *   - this is intentional, as it allows us to catch more errors (create safer code)
       *
       * There are several reasons why NOT isolating tests result in catching more errors.
       * On the backend:
       *   - we have a single database running on the background, so isolation doesn't help as the database is shared
       *   - the global state is shared by design, so consecutive invokes of the same HTTP endpoints processed faster
       *     by not isolating the tests, we test whether global state is properly reused
       */
      poolOptions: {
        threads: {
          isolate: false,
        },
        forks: {
          isolate: false,
        },
      },
      browser: {
        isolate: false,
        name: `tdd`,
      },
    },
  } satisfies ViteUserConfig
}

export default defineConfig(() => getConfig())
