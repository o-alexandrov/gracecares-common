export const protocol = `https://`
export const urlScheme = `${process.env.DOMAIN}://` as const

/**
 * CDN endpoint of the website
 */
// export const endpointWebsite = `${protocol}${process.env.DOMAIN}` as const
export const endpointWebsite = `https://d26yatbmmh5vqo.cloudfront.net`
export const localApiPort = 4444
export const endpointAPI =
  process.env.NODE_ENV === `development` && !process.env.NATIVE_APP
    ? (`${protocol}${process.env.LOCALHOST}:${localApiPort}/` as const)
    : (`${endpointWebsite}/` as const)
