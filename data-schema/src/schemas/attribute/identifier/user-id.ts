import * as common from "./_common"

export { regex } from "./_common"

export const name = common.setNamePostfix(`user`)

export const variants = {
  generic: common.definition,
  network: {
    ...common.definition,
    description: [
      common.definition.description,
      `Care recipient's identifier.`,
    ],
  },
} as const satisfies OA3.Variants
