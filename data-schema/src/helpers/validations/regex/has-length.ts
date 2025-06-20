/**
 * Returns rule for fixed text length validation
 * @param length of the string
 *
 * @see https://regexr.com/4lc19 Regex rule in action
 */
export const hasLength = (length: number): DataSchema.ValidationRegExp => ({
  msg: `Must be ${length} chars`,
  exp: new RegExp(`^.{${length}}$`),
})
