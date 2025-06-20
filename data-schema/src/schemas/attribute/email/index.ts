import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `email`
/**
 * Can check regexes here:
 * @see https://regexr.com/4hq79
 * Inspired by https://emailregex.com/ for the JavaScript case
 */
export const regex: DataSchema.ValidationRegExp[] = [
  ...helpers.hasLengths(5, 254),
  helpers.hasChar(`@`),
  {
    msg: `Invalid part after @`,
    exp: /^((([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+")))@.*$/,
  },
  {
    msg: `Invalid part before @`,
    exp: /.*@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
  },
]

export const checkIsEmail = helpers.createRegexTester(regex)

export const definition = {
  type: `string`,
  description: `Email conforming to RFC 5322`,
  example: `test@example.com`,
  externalDocs: {
    description: `RFC 5322`,
    url: `https://www.ietf.org/rfc/rfc5322.txt`,
  },
  regex,
  preprocess: `trimAndLowerCase`,
} satisfies OA3.Attribute
