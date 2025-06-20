type validation = DataSchema.ValidationRegExp | DataSchema.ValidationRegExp[]
/**
 * Transform @see DataSchema.ValidationRegExp to RegExp in a string type
 * @returns a regular expression in a string format
 *
 * @see https://github.com/rollup/rollup/pull/5024/files#diff-27c8cfd628eaad81fce447b195e2ec3b2d7f6b99d237450c86fae0a44c7d24eeR2042
 * @__NO_SIDE_EFFECTS__
 * @__PURE__
 */
export const validationToString = (validation: validation): string => {
  if (!Array.isArray(validation)) return validation.exp.toString()

  let result = ``
  for (const item of validation) {
    const regexAsString = item.exp.toString() // it has a leading and a trailing "/" (forward slash) that need to be removed
    if (item.exp.flags) throw new Error(`Flags are not supported yet`)
    result += `(?=${regexAsString.substring(1, regexAsString.length - 1)})`
  }
  return result
}
