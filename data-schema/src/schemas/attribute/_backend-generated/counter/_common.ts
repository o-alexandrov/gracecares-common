export const setDefinition = (schema: {
  description: OA3.Description
  example: number
}) =>
  ({
    readOnly: true,
    type: `number`,
    format: `int32`,
    ...schema,
  }) satisfies OA3.Attribute
