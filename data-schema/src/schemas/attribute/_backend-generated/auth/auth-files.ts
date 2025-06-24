import { _dangerousUndocumentedProperties, description } from "./_common"

export const name = `authFiles`

export const definition = {
  type: `array`,
  readOnly: true,
  description,
  items: {
    $ref: `#/components/schemas/authFile`,
  },
} satisfies OA3.Attribute
