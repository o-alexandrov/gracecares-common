import * as common from "./_common"

export { regex } from "./_common"

export const name = common.setNamePostfix(`assignee`)

export const definition = {
  ...common.definition,
  description: [
    common.definition.description,
    `The assignee is a person who is assigned to a specific task within a network.`,
  ],
} satisfies OA3.Attribute
