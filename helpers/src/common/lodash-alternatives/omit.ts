/**
 * Same as "lodash.omit" but simplified @see https://lodash.com/docs/latest#omit
 *
 * Creates an object composed of the own and inherited enumerable property paths of object that are not omitted
 *
 * @category — Object
 *
 * @param object — The source object.
 * @param props - The property names to omit, specified individually or in arrays.
 * @returns — Returns the new object.
 *
 * @example
 * const obj = { 'a': 1, 'b': '2', 'c': 3 };
 * const result = omit(object, ['a', 'c']);
 * result // => { 'b': '2' }
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  object: T,
  props: readonly K[] | K,
): Omit<T, K> => {
  const listOfProps = (Array.isArray(props) ? props : [props]) as K[]
  const result: Partial<T> = {}
  for (const key in object) {
    if (!listOfProps.includes(key as unknown as K)) result[key] = object[key]
  }
  return result as Omit<T, K>
}
