/**
 * Return two rules for string length validation
 *
 * Difference between "\s\S" and "." @see https://stackoverflow.com/questions/35248876/whats-the-difference-between-s-s-and-in-java-regular-expressions/35248940
 *   - we use "\\" before "s" and "S" because template literals use "\" to preserve a character that goes after "\"
 *
 * @param min length of the string (inclusive)
 * @param max length of the string (inclusive)
 */
export const hasLengths = (
  min: number,
  max: number,
  multiline?: boolean,
): DataSchema.ValidationRegExp[] => [
  {
    msg: `Minimum ${min} chars`,
    exp: new RegExp(`^${multiline ? `[\\s\\S]` : `.`}{${min},}$`),
  },
  {
    msg: `Maximum ${max} chars`,
    exp: new RegExp(`^${multiline ? `[\\s\\S]` : `.`}{0,${max}}$`),
  },
]
