import * as helpers from "@gracecares-ai/data-schema/src/helpers"

/**
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html
 * @notes cognito supports
 *   - uppercase and lowercase letters
 *   - numbers
 *   - the equals sign "="
 *   - the plus sign "+"
 *   - the special characters: ^ $ * . [ ] { } ( ) ? - " ! @ # % & / \ , > < ' : ; | _ ~ `
 * @notes cognito does not support:
 *   - space character
 */
/**
 * Rules for password policy are here
 *   - length between 6 and 31 including
 *   - space symbol is not allowed
 *   - allow only
 *      - latin characters
 *      - numbers
 *      - special symbols from the cognito policy (see above)
 */
export const regex: DataSchema.ValidationRegExp[] = helpers.hasLengths(6, 64)

export const setDefinition = (schema: {
  description: string
  example: string
}) =>
  ({
    type: `string`,
    regex,
    ...schema,
  }) satisfies OA3.Attribute
