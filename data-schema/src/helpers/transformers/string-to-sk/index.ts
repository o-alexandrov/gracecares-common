/**
 * Toggle debug mode. It is removed during tree-shaking, if the value is false
 */
const debug = false

const replaceArgs: [string | RegExp, string][] = [
  /**
   * Replace punctuation, or emoji with "-"
   * "u" flag for Unicode @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
   */
  [/[\p{P}\p{Emoji_Presentation}]/gu, `-`],
  /**
   * Replace characters that are not caught by Unicode's match with "-"
   */
  [/[\s=+~]/g, `-`],
  /**
   * Replace consecutive dashes or underscores with one dash
   *   @example "a_-b" => "a-b"
   */
  [/[-_]{2,}/g, `-`],
  /**
   * Remove leading and trailing dashes or underscores
   */
  [/^[-_]|[-_]$/g, ``],
]

/**
 * Format a string to be used as part of a URL or stored in a database
 */
export const stringToSk = <v extends string>(string: v) => {
  let response = (string || ``).trim().toLowerCase() // keep empty string as a precaution for runtime errors

  for (const args of replaceArgs) {
    response = response.replace(...args)
    if (debug) console.log(response) // This line is removed during tree-shaking, if "debug" is false
  }

  return response
}
