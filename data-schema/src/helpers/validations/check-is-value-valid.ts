/**
 * Get error messages (if any) for a specific "value" & "validations"
 *
 * @notes language is important for error messages, so we accept "validations" for a specific language
 */
export const getValueErrors = (
  value: string,
  validations: DataSchema.Validation[],
  /**
   * Form context exists on the frontend only
   */
  formId?: string,
) => {
  const errorMessages: string[] = []

  for (const validation of validations) {
    const check = validation.exp
    const isValid =
      typeof check === `function`
        ? (check as any)(value, formId)
        : check.test(value)
    if (!isValid) errorMessages.push(validation.msg)
  }

  return errorMessages
}

/**
 * Checks whether "value" satisfies "validations"
 *
 * @notes language won't affect the result, so we always use English
 */
export const checkIsValueValid = (
  value: string,
  regex: DataSchema.Validation[],
): boolean => {
  const errorMessages = getValueErrors(value, regex)
  const hasErrors = errorMessages.length
  return hasErrors ? false : true
}

export const createRegexTester =
  (regex: DataSchema.Validation[]) => (value: string) =>
    checkIsValueValid(value, regex)
