/**
 * @IMPORTANT If the value is a number
 *   - do NOT change the existing numbers as we would need to rewrite the database
 */
import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `expectation`

export enum options {
  gettingBetter = 3,
  stayingTheSame = 4,
  gettingWorse = 5,
}

export const mapOptionsToLabels = {
  [options.gettingBetter]: `Getting better (Recovery)`,
  [options.stayingTheSame]: `Staying about the same (Stable)`,
  [options.gettingWorse]: `Likely to get harder (Decline)`,
}

export const optionsList = Object.keys(mapOptionsToLabels).map((key) => ({
  value: key,
  label: mapOptionsToLabels[key],
}))

export const definition = helpers.enumOrObjectToOpenapi(
  `Network care expectations`,
  options,
)
