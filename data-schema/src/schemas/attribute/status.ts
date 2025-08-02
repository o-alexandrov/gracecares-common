/**
 * @IMPORTANT If a status is a number
 *   - do NOT change the existing numbers as we would need to rewrite the database
 */
import * as helpers from "@gracecares-ai/data-schema/src/helpers"
import type * as TF from "type-fest"

export const name = `status`

export enum user {
  invited = 5,
}

export const variants = {
  user: helpers.enumOrObjectToOpenapi(`User status. e.g "invited"`, user),
} as const satisfies OA3.Variants
