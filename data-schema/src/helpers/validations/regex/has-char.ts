/**
 * Check a char on string parameter
 * @param char expected symbol
 */
export const hasChar = (char: string): DataSchema.ValidationRegExp => ({
  msg: `Need ${char} character`,
  exp: new RegExp(`.*${char}.*`),
})
