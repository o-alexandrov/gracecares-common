/**
 * JSON.parse and decode base64 URL-safe string
 */
export const decodeItem = (encodedItem: string) => {
  const base64 = decodeURIComponent(encodedItem)
  return JSON.parse(atob(base64))
}
