export const name = `token`

export const definition = {
  type: `string`,
  example: `a_long_and_random_token`,
  description: `A secure value (token) that can be used to authenticate`,
} satisfies OA3.Attribute
