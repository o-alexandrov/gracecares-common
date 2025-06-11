/**
 * Same as "lodash.chunk" but simplified @see https://lodash.com/docs/latest#chunk
 *
 * Divides array into chunks
 *
 * @see https://stackoverflow.com/a/60779547
 *      https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_chunk
 */
export const chunk = <I>(array: I[], size: number) =>
  array.reduce((acc: I[][], _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size))
    return acc
  }, [])
