import * as commonHelpers from "@gracecares-ai/helpers"

import * as common from "./_common"

export const name = `ttl`

/**
 * Returns timestamp in hours when the account is scheduled for removal
 * @returns either exactly 7 days from now or up to 1 hour earlier due to `Math.floor` within `getTimestampInHours`
 *   - we always want to have slightly less than 7 days to avoid displaying "account will be removed in more than 7 days" due to rounding when displaying the countdown
 */
export const getTimestampForAccountRemoval = () => {
  const now = commonHelpers.getTimestampInHours()
  return now + 24 * 7
}

const add = {
  type: `boolean`,
  enum: [true],
  description: `Request \`ttl\` to be added to the \`item\``,
} satisfies OA3.Attribute

export const variants = {
  ...common.variants,
  add,
} as const satisfies OA3.Variants
