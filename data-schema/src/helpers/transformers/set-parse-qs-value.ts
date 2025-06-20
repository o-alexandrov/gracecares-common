export interface setParseQueryStringValue<D extends number | undefined> {
  /**
   * Minimum value to return
   *   - required to ensure safety
   */
  min: number
  /**
   * Maximum value to return
   *   - required to ensure safety
   */
  max: number
  /**
   * Default value to return, when query string is "undefined"
   */
  default?: D
}

/**
 * Use it only if the returning value should be a number
 *   - if the returning value should be a string, just use "qsValue || undefined" (w/o any helper function)

@example
const functionToParseQueryStringValue = setParseQueryStringValue({
  min: 1,
  max: 100,
  default: 10,
})
const value = functionToParseQueryStringValue("") // 10
const value = functionToParseQueryStringValue("8") // 8
const value = functionToParseQueryStringValue("200") // 100
 */
export const setParseQueryStringValue =
  <D extends number | undefined>(props: setParseQueryStringValue<D>) =>
  (qs?: string): D extends number ? number : number | undefined => {
    if (!qs) return props.default as D extends number ? number : undefined

    const value = Number(qs)
    return Math.min(Math.max(value, props.min), props.max)
  }
