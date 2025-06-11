/**
 * Same as "lodash.merge" but simplified @see https://lodash.com/docs/latest#merge
 *
 * Recursively merges own and inherited enumerable string keyed properties of source objects into the destination object.
 * Source properties that resolve to undefined are skipped if a destination value exists.
 * Array and plain object properties are merged recursively.
 * Other objects and value types are overridden by assignment.
 * Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * @param obj — The destination object
 * @param sources — The source objects
 *
 * @example
 * const obj = { a: [{ b: { c: 7 } }] }
 * merge(obj, { a: [{ b: { d: 9 } }] })
 * obj // => { a: [{ b: { c: 7, d: 9 } }] }
 *
 * @example
 * const obj = { a: [{ b: { c: 7 } }] }
 * merge(obj, { a: [{ b: { c: 9 } }] })
 * obj // => { a: [{ b: { c: 9 } }] }
 */
export const merge = (
  obj: Record<string, any>,
  ...sources: Record<string, any>[]
) => {
  for (const source of sources) {
    for (const key in source) {
      if (source[key] === undefined) continue
      if (Array.isArray(source[key])) {
        if (!Array.isArray(obj[key])) obj[key] = []
        merge(obj[key], source[key])
      } else if (source[key] !== null && typeof source[key] === `object`) {
        if (typeof obj[key] !== `object`) obj[key] = {}
        merge(obj[key], source[key])
      } else {
        obj[key] = source[key]
      }
    }
  }

  return obj
}
