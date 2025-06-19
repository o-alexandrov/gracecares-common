import * as env from "@gracecares-ai/env"

/**
 * When our web app is loaded in a browser, we have a base pathname for assets
 * This function automatically selects the correct pathname based on the environment
 */
export const getPublicAssetPathname = (assetPath: string) => {
  const absolutePath = `/${assetPath}`
  return process.env.NATIVE_APP || process.env.NODE_ENV === `development`
    ? absolutePath
    : `/${env.assetsDirectoryName}${absolutePath}`
}
