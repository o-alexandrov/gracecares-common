import fs from "node:fs/promises"

import * as commonHelpers from "@gracecares-ai/helpers"
import { generate } from "orval" // same as default import from "orval"

import { apiClientBuilder } from "./api-and-typings"
import { zodClientBuilder } from "./zod"

export const generateBuildFiles = async (spec: OA3.OpenAPIObject) => {
  const specNoDescriptions = commonHelpers.removeObjectPropsRecursively(
    spec,
    `description`,
  )

  const removeFileWithDuplicateSchemas = () =>
    fs.rm(
      new URL(`../../../build/validators.schemas.ts`, import.meta.url).pathname,
    )

  await Promise.all([
    // Generate validators (using Zod)
    generate({
      output: {
        mode: `split`,
        target: `./build/validators.ts`,
        unionAddMissingProperties: true, // adds missing properties to union types as "never"
        // client: (clients) => ({
        //   ...clients.zod,
        //   dependencies: () => [
        //     {
        //       exports: [{ name: `z`, alias: `zod`, values: true }],
        //       // dependency: `zod/v4-mini`, // waiting for orval to support this
        //       dependency: `zod/v4`,
        //     },
        //   ],
        //   // client: (...args)
        // }),
        client: () => zodClientBuilder,
        override: {
          zod: {
            generate: {
              param: false,
              query: false,
              header: false,
              response: false,
              body: true,
            },
          },
        },
      },
      input: { target: specNoDescriptions as any },
    }).then(removeFileWithDuplicateSchemas),
    // Generate API client
    generate({
      output: {
        mode: `split`,
        target: `./build/api.ts`,
        unionAddMissingProperties: true, // adds missing properties to union types as "never"
        httpClient: `fetch`,
        client: () => apiClientBuilder,
        mock: false, // do not generate mocks (msw/faker)
        override: {
          fetch: {
            includeHttpResponseReturnType: false,
          },
          mutator: {
            path: `./src/orval/fetch.ts`,
            name: `req`,
          },
          paramsSerializer: {
            path: `./src/orval/params-serializer.ts`,
            name: `queryString`,
          },
        },
      },
      input: { target: spec as any },
    }).then(async () => {
      // Post-process the generated API file to add @ts-ignore comments
      const apiFilePath = new URL(`../../../build/api.ts`, import.meta.url)
        .pathname
      const content = await fs.readFile(apiFilePath, `utf8`)

      // Add @ts-ignore comment above ALL frontend-toolkit imports
      let updatedContent = content.replace(
        /(import \{[^}]*)(\} from '@gracecares-ai\/frontend-toolkit\/src\/plugins\/http';)/g,
        `$1// @ts-ignore\n$2`,
      )

      // Also handle type imports
      updatedContent = updatedContent.replace(
        /(import type \{[^}]*)(\} from '@gracecares-ai\/frontend-toolkit\/src\/plugins\/http';)/g,
        `$1// @ts-ignore\n$2`,
      )

      await fs.writeFile(apiFilePath, updatedContent)
    }),
  ])
}
