export const regexOnlyNumbers: DataSchema.ValidationRegExp = {
  msg: `Only numbers`,
  exp: /^\d+$/, // https://stackoverflow.com/questions/273141/regex-for-numbers-only
}
