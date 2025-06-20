import fs from "node:fs/promises"
import path from "node:path"

import lodash from "lodash"

import * as paths from "../paths"

export const writeFile = async (filename: string, data: string) => {
  const fileName = path.join(
    paths.buildCustom,
    `${lodash.kebabCase(filename)}.ts`,
  )
  return fs.writeFile(fileName, data)
}
