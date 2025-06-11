/**
 * Same as "lodash.pick" but simplified @see https://lodash.com/docs/latest#pick
 *
 * Creates an object composed of the picked object properties.
 *
 * @category — Object
 *
 * @param object — The source object.
 * @param props - The property names to pick, specified individually or in arrays.
 * @returns — Returns the new object.
 *
 * @example
 * const obj = { 'a': 1, 'b': '2', 'c': 3 };
 * const result = pick(object, ['a', 'c']);
 * result // => { 'a': 1, 'c': 3 }
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  object: T,
  props: readonly K[] | K,
): Pick<T, K> => {
  const listOfProps = (Array.isArray(props) ? props : [props]) as K[]
  const result: Partial<T> = {}
  for (const key of listOfProps) {
    if (object[key] !== undefined) result[key] = object[key]
  }
  return result as Pick<T, K>
}
