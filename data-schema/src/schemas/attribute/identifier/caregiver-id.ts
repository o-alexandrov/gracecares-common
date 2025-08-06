import * as common from "./_common"

export { regex } from "./_common"

export const name = common.setNamePostfix(`caregiver`)

export const definition = {
  ...common.definition,
  description: [
    common.definition.description,
    `The caregiver is a person who provides care for another individual within a network.`,
  ],
} satisfies OA3.Attribute
