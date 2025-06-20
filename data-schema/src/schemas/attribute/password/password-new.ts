import * as common from "./_common"
import { name as passwordName } from "./password"
export { regex } from "./_common"

export const name = `${passwordName}New` as const

export const definition = common.setDefinition({
  example: `my_new_password`,
  description: `A new password value (We encrypt the value)`,
})
