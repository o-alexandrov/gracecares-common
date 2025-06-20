import path from "node:path"

import fg from "fast-glob"

import { checkIsValidRouteFilename } from "./check-is-valid-route-filename"

export interface HandlerProps {
  file: string
  method: string
  route: string
  hasAuthorization: boolean
}

/**
 * Returns details of the HTTP handler files in the directory
 * @param pathToDirectory file path to the directory containing the HTTP handler files
 */
export const getHandlersProps = async (
  pathToDirectory: string,
): Promise<HandlerProps[]> => {
  const filesFullPath = await fg(
    `${pathToDirectory}/**/(delete|get|patch|put|post)?(-auth).ts`,
  )
  return filesFullPath.map((file) => {
    const pathFromHttpDir = file.split(pathToDirectory).pop()!
    const route = path.dirname(pathFromHttpDir)
    checkIsValidRouteFilename(file, route)

    const [method, hasAuthorization] = path
      .basename(file)
      .split(`.`)[0]
      .split(`-`)

    if (hasAuthorization && hasAuthorization !== `auth`) {
      throw new Error(
        `Invalid handler file name: "${file}"\n` +
          `Handlers w/ Authorization check must end with "-auth.ts"\n`,
      )
    }

    return {
      file,
      /** @example post */
      method,
      /** @example "v1/order/{buyer}/{seller}/{created}" */
      route,
      /** Whether the handler requires Authorization header */
      hasAuthorization: hasAuthorization === `auth`,
    }
  })
}
