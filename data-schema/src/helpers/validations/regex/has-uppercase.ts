/**
 * Need 1 uppercase caharacter from [A-Z]
 */
export const hasUppercase: DataSchema.Validation = {
  msg: `Need 1 uppercase`,
  exp: /[A-Z]/,
}
