import * as common from "./_common"
export { regex } from "./_common"

export const name = `password`

export const definition = common.setDefinition({
  example: `my_password`,
  description: `A secret word or phrase used to log in (We encrypt the value)`,
})
