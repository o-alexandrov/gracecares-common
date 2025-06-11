import type * as TF from "type-fest"

import { getPathAsArray } from "./_common"
/**
 * Same as "lodash.get" but simplified @see https://lodash.com/docs/latest#get
 *
 * Gets the property value at path of object.
 *
 * @param object — The object to query
 * @param path — The path of the property to get
 * @returns the resolved value
 *
 * @example
 * const obj = { a: [{ b: { c: 3 } }] }
 * const result = get(obj, 'a[0].b.c')
 * result // => 3
 */
export const get = <O extends Record<string, any>>(
  obj: O,
  path: TF.Paths<O> | string,
) => {
  if (!path) return obj // there could be a typing/runtime error

  const result = getPathAsArray(path as string).reduce(
    (res, key) => (res !== null && res !== undefined ? res[key] : res),
    obj,
  )
  return result as any
}
