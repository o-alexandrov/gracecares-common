/**
 * Need 1 lowercase character from [a-z]
 */
export const hasLowercase: DataSchema.Validation = {
  msg: `Need 1 lowercase`,
  exp: /[a-z]/,
}
