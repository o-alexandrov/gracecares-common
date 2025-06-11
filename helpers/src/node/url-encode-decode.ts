/**
 * JSON.stringify and base64 encode a URL-safe string
 */
export const encodeItem = (item: any) => {
  const base64 = Buffer.from(JSON.stringify(item)).toString(`base64`)
  return encodeURIComponent(base64)
}

export const decodeItem = (encodedItem: string) => {
  const base64 = decodeURIComponent(encodedItem)
  return JSON.parse(Buffer.from(base64, `base64`).toString(`ascii`))
}
