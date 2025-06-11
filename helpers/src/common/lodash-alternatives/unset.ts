import { getPathAsArray } from "./_common"

/**
 * Same as "lodash.unset" but simplified @see https://lodash.com/docs/latest#unset
 *
 * Removes the property at path of object.
 * Note: This method mutates object.
 *
 * @param obj — The object to modify
 * @param path — The path of the property to unset
 *
 * @example
 * const obj = { a: [{ b: { c: 7 } }] }
 * unset(obj, 'a[0].b.c')
 * obj // => { a: [{ b: {} }] }
 */
export const unset = (obj: Record<string, any>, path: string) => {
  const pathArr = getPathAsArray(path)
  const lastKey = pathArr.pop()!
  for (const key of pathArr) {
    if (obj[key] === undefined) return
    obj = obj[key]
  }
  delete obj[lastKey]
}
