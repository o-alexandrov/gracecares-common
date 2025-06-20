import type * as TF from "type-fest"

/**
 * Converts an enum or object to an OpenAPI schema for a primitive type
 * @notes
 *   - must NOT have empty keys
 *   - must NOT have mixed types (to avoid confusion, so we don't store mixed type attributes on the backend)
 *
 * See the tests for examples
 *
 * @__NO_SIDE_EFFECTS__
 * @__PURE__
 */
export const enumOrObjectToOpenapi = <
  E extends Record<string, string | number>,
>(
  label: string,
  enumOrObject: E,
) => {
  if (!label) throw new Error(`label is empty`)
  const keys = Object.keys(enumOrObject)
  if (!keys.length) throw new Error(`enumOrObject "${label}" is empty`)

  let isEnumWithNumbers = false
  let numOfEnumValues = 0
  for (const key of keys) {
    const value = enumOrObject[key]
    if (typeof value === `string` && typeof enumOrObject[value] === `number`) {
      isEnumWithNumbers = true
      numOfEnumValues++
    }
  }

  if (isEnumWithNumbers && numOfEnumValues !== keys.length / 2) {
    throw new Error(
      `enum "${label}" has mixed types. It must be all numbers or all strings`,
    )
  }

  const startIndex = isEnumWithNumbers ? keys.length / 2 : 0

  const type = typeof enumOrObject[keys[startIndex]]
  const options: (string | number)[] = []
  const description = [`${label}:`]

  for (let i = startIndex; i < keys.length; i++) {
    const key = keys[i]
    const value = enumOrObject[key]
    if (typeof value !== type) {
      throw new Error(
        `object "${label}" has values of different types (expecting all "${type}")`,
      )
    }
    if (options.includes(value)) {
      throw new Error(`"${label}" has a duplicate value "${value}"`)
    }

    options.push(value)
    description.push(
      value === key ? `- \`${value}\`` : `- \`${value}\` (${key})`,
    )
  }

  return {
    title: label,
    type: type as TF.LiteralToPrimitive<E[keyof E]> extends string
      ? `string`
      : `number`,
    // @ts-expect-error - TS can't infer the resulting type is either string[] or number[]
    enum: options as E[keyof E][],
    description,
  } satisfies OA3.Attribute
}
