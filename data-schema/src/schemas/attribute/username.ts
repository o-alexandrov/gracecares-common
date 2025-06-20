import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `username`
const maxLength = 30

/**
 * Convert a "username" value from our database to "sk" value
 */
export const toSk = <v extends string | undefined>(v: v) =>
  (v || ``).toLowerCase() // keep empty string as a precaution for runtime errors

export const unknownToUsername = (v: string) =>
  v.replace(/[^\w\-.]/g, ``).substring(0, maxLength)
/**
 * Convert any unknown value to "sk" value (ex. to convert a value from a 3rd party to our "sk" value)
 */
export const unknownToSk = (v: string) => toSk(unknownToUsername(v))

export const regex: DataSchema.ValidationRegExp[] = [
  ...helpers.hasLengths(1, maxLength),
  {
    msg: `Only latin letters, numbers, hyphen and dot are allowed`,
    /**
     * @notes \w matches a-z A-Z 0-9 and _ (underscore) @see https://www.w3schools.com/jsref/jsref_regexp_wordchar.asp
     */
    exp: /^[\w\-.]+$/,
  },
]

export const definition = {
  type: `string`,
  example: `John`,
  description: [
    `Must be unique. \`john\` & \`John\` are considered the same due to case-insensitivity.`,
    `A user can still save their username with uppercase letters, but the case will be preserved \`only\` for the display purposes.`,
    `\`username\` exists for/in:`,
    `- URLs`,
    `- mentions`,
    `- search`,
    `- etc.`,
  ],
  regex,
  preprocess: `trim`,
} satisfies OA3.Attribute
