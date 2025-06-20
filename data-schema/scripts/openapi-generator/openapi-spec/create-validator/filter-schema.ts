/** It's dangerous to remove object properties, as we filter recursively (ex. cases anyOf) */
const primitiveKeysToRemove: string[] = [
  `title`,
  `description`, // description is unused in the validator, but can be long
  `example`,
]

/** @deprecated unused */
export const filterSchema = (schema: Record<string | number, any>) => {
  for (const key of Object.keys(schema)) {
    const isPlainObject =
      schema[key] &&
      typeof schema[key] === `object` &&
      !Array.isArray(schema[key])
    if (primitiveKeysToRemove.includes(key) && !isPlainObject) {
      delete schema[key]
      continue
    }

    /**
     * @notes cannot remove `type: 'string'` when `pattern` is present
     */
    if (key === `type` && schema.enum) {
      delete schema.type /** @see https://github.com/ajv-validator/ajv/issues/1965 */
      continue
    }

    /**
     * Can be only either "Array" or plain "Object" w/ properties { ... }
     * Must be after checks above
     */
    if (typeof schema[key] === `object`) {
      if (Array.isArray(schema[key])) {
        for (const item of schema[key]) filterSchema(item)
      } else filterSchema(schema[key])

      continue
    }
  }
}
