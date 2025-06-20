/* eslint-disable @typescript-eslint/no-floating-promises */

declare namespace DataSchema {
  import(`type-fest`)
  import type * as TF from "type-fest"

  export interface ValidationCommon {
    msg: string // error message
  }
  export type ValidationRegExp = ValidationCommon & { exp: RegExp } // regular expression
  export type ValidationCustom = ValidationCommon & {
    exp: (newValue: string) => boolean
  }
  export type Validation = ValidationRegExp | ValidationCustom

  import(`../build/api.schemas`)
  export type * from "../build/api.schemas"
  import(`../build/api`)
  export type * from "../build/api"

  export interface Paginated<Item = any> {
    items: Item[]
    page?: string
  }

  /**
   * Converts raw object that is passed to `URLSearchParams` to a backend query string
   * 
   * ## How to use:
   * 
   * @example
   * const { page, limit, isSeller } = (event.queryStringParameters || {}) as unknown as DataSchema.BackendQS<DataSchema.GetV1OrderParams>
   * @end of example
   *
   * ## How it works:
   * 
   * @example input
       interface GetV1OrderParams {
         page?: string
         limit?: number
         status: 0 | 3 | 5
         isSeller?: boolean
         r18?: "0" | "1"
       }

       type result = {
         page?: string | undefined;
         limit?: string | undefined;
         status: "0" | "3" | "5";
         isSeller?: "true" | "false" | undefined;
         r18?: "0" | "1" | undefined;
       }
   */
  export type BackendQS<
    Params extends Record<string, string | number | boolean>,
  > = {
    [key in keyof Params]: Params[key] extends boolean | number | undefined // condition to infer literal value, if exists
      ? Params[key] extends boolean | undefined
        ? `true` | `false`
        : TF.IsNumericLiteral<NonNullable<Params[key]>> extends true
          ? `${NonNullable<Params[key]>}`
          : string
      : Params[key]
  }
}
