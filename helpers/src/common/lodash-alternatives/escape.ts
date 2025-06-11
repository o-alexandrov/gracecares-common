/** Used to map characters to HTML entities. */
const htmlEscapes = {
  "&": `&amp;`,
  "<": `&lt;`,
  ">": `&gt;`,
  '"': `&quot;`,
  "'": `&apos;`,
}
/**
 * Same as "lodash.escape" but simplified @see https://lodash.com/docs/latest#escape
 *
 * Converts the characters "&", "<", ">", '"', and "'" in string to their corresponding HTML entities.
 *
 * @param str — The string to escape
 * @returns the escaped string
 *
 * @example
 * const result = escape('fred <script>alert("hi")</script>')
 * // result => 'fred &lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;'
 */
export const escape = (str: string) =>
  str.replace(/[&<>"']/g, (char) => htmlEscapes[char])

/**
 * When you want to escape only the inner HTML, not the whole string.
 */
export const escapeInnerHtml = (str: string) =>
  str.replace(/[<>]/g, (char) => htmlEscapes[char])
