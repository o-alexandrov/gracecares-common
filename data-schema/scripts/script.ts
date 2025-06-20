import fs from "node:fs/promises"

import { runCustomProcessing } from "./custom-processing"
import { generateBuildFiles } from "./openapi-generator/generate-build-files"
import { getOpenApiSpec } from "./openapi-generator/openapi-spec"
import * as paths from "./paths"

const run = async () => {
  const [openapiSpec] = await Promise.all([
    getOpenApiSpec(),
    fs.mkdir(paths.publicDir).catch(() => null), // ignore error if dir already exists
  ])

  await Promise.all([
    generateBuildFiles(openapiSpec),
    runCustomProcessing(),
    fs.writeFile(paths.openAPISpec, JSON.stringify(openapiSpec, null, 2)),
  ])
}

void run()
