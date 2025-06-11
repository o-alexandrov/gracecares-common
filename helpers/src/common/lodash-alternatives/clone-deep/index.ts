/**
 * Deep clone a value, handling primitives, objects, arrays, dates, regexes, and File/Blob objects.
 * For File and Blob objects, returns the original reference since they are immutable.
 */
export const cloneDeep = <T>(value: T): T => {
  if (
    // Handle primitives (null, undefined, string, number, boolean, symbol, bigint)
    value === null ||
    typeof value !== `object` ||
    // Handle File and Blob objects - return original reference since they are immutable
    // No need to copy the binary data, which can be expensive for large files
    value instanceof File ||
    value instanceof Blob ||
    // cases where we just don't want to clone, because we don't ever mutate these types of values
    value instanceof RegExp
  ) {
    return value
  }

  if (value instanceof Date) return new Date(value.getTime()) as T
  if (Array.isArray(value)) return value.map(cloneDeep) as T

  if (typeof value === `object`) {
    const clone: Record<string, any> = {}
    for (const key of Object.keys(value)) clone[key] = cloneDeep(value[key])
    return clone as unknown as T
  }

  if (process.env.NODE_ENV !== `production`) {
    throw new Error(`Unable to copy value! Its type isn't supported.`)
  }
  return undefined as never
}
