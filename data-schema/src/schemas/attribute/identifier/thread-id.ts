import * as common from "./_common"

export { regex } from "./_common"

export const name = common.setNamePostfix(`thread`)

export const definition = {
  ...common.definition,
  description: [
    common.definition.description,
    `The thread is a series of messages`,
  ],
} satisfies OA3.Attribute
