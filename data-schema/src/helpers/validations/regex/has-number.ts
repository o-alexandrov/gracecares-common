export const hasNumber: DataSchema.Validation = {
  msg: `Need 1 number`,
  exp: /\d/, // https://stackoverflow.com/questions/273141/regex-for-numbers-only
}
