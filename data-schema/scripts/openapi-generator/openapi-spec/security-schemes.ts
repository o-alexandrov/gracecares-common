type authTypes = `jwt`

/**
 * @see https://swagger.io/docs/specification/authentication/bearer-authentication/
 */
const setSecurityScheme = (type: authTypes) => ({ [type]: [] })

export const securitySchemes: {
  [key in authTypes]: OA3.SecuritySchemeObject
} = {
  jwt: {
    type: `http`,
    scheme: `bearer`,
    bearerFormat: `JWT`,
  },
}

export const jwt = setSecurityScheme(`jwt`)
