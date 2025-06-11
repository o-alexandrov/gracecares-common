import { getPathAsArray } from "./_common"
/**
 * Same as "lodash.set" but simplified @see https://lodash.com/docs/latest#set
 *
 * Sets the value at path of object.
 * If a portion of path doesn’t exist it’s created.
 * Arrays are created for missing index properties while objects are created for all other missing properties.
 *
 * @param object — The object to modify.
 * @param path — The path of the property to set.
 * @param value — The value to set.
 * @return — Returns object.
 *
 * @example
 * const obj = { a: [{ b: { c: 3 } }] }
 * const result = set(obj, 'a[0].b.c', 4)
 * result // => { a: [{ b: { c: 4 } }] }
 */
export const set = (
  obj: Record<string, any>,
  path: string,
  value: unknown,
): Record<string, any> => {
  const pathArr = getPathAsArray(path)
  const lastKey = pathArr.pop()!
  const lastObj = pathArr.reduce((res, key) => (res[key] = res[key] || {}), obj)
  lastObj[lastKey] = value
  return obj
}
