const setDefinition = (type: `seconds` | `hours` | `days`) => {
  let optionsByType: { example: number }
  switch (type) {
    case `seconds`:
      optionsByType = {
        example: 1648999378,
      }
      break
    case `hours`:
      optionsByType = {
        example: 458055,
      }
      break
    case `days`:
      optionsByType = {
        example: 1,
      }
      break
  }

  return {
    type: `number`,
    format: `int32`,
    description: `Timestamp in ${type}`,
    ...optionsByType,
  } satisfies OA3.Attribute
}

export const variants = {
  seconds: setDefinition(`seconds`),
  hours: setDefinition(`hours`),
  days: setDefinition(`days`),
} as const satisfies OA3.Variants
