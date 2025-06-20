/**
 * In case we add SSR in the future, we would add a prefix for the public assets.
 */
export const getPublicAssetPathname = (assetPath: string) => {
  const absolutePath = `/${assetPath}`
  return absolutePath
}
