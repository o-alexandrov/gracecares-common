/* eslint-disable @typescript-eslint/consistent-type-definitions */

type PickIndexSignature<O> = import("type-fest").PickIndexSignature<O>
type StringKeyOf<O> = import("type-fest").StringKeyOf<O>
type MergeExclusive<A, B> = import("type-fest").MergeExclusive<A, B>

type Falsy = false | 0 | `` | null | undefined

type hasIndexSignature<O> = keyof PickIndexSignature<O> extends never
  ? false
  : true

type getLiteralsWithFallback<O> = keyof O extends never[]
  ? string
  : StringKeyOf<O>
/**
 * Improves type inference and discourages mutation of an Object
 *   - Object.keys returns string[] by default
 */
declare interface ObjectConstructor {
  /**
   * Unless an object type "O" has an index signature, we should get a list of literals
   */
  keys<O extends Record<string, unknown>>(
    o: O,
  ): (hasIndexSignature<O> extends true ? string : getLiteralsWithFallback<O>)[]
}

declare type MergeExclusiveMultiple<T extends any[]> = T extends [
  infer U,
  ...infer R,
]
  ? MergeExclusive<U, MergeExclusiveMultiple<R>>
  : never

/**
 * This utility type ensures: one type satisfies another
 * @example @see https://www.typescriptlang.org/play?ssl=8&ssc=1&pln=9&pc=1#code/C4TwDgpgBA6glgEwgFXNAvFAShAxgewCcEAeAZ2ELgDsBzAGimoFcBbAIwkID4BuAWABQBahSYBDQoXwB3AGriANswhkomAN5CoOqAAsIixfgBcUACz1tumUUUIzAViuCAvlDLjgcMgDM4qrCIKGgCgkJCoJBQAMpePv6qJACqjMhQEAAewBDUCGrJ3OpQyGFR0AByktIyqNGYcd5+AWQk8Eh1EIxagrr6hsZmltY6toT2Ti6u3BGC5VAAQuIIVVKyncWNCS1twZ3dI-1GplAARPj4YGSnLn1jE1COQtNCAPSvJWhQAOQaR4NnC5XU68KD3ByPUGub5QBD4QLUfDADzxPwgKDAAxQEQUQjiGjI77tEKQb4AOjeHx0AAVpJBCKAfgZjjCfFAaARWGB4uxFNAZHBMey8lkPHBaNQvMxCBAKYJ3n1PtFvriaLRWWpEcjxGQyOLJbzoMB8Bivt8WBwuOShEA
 */
declare type Satisfies<U, T extends U> = T
