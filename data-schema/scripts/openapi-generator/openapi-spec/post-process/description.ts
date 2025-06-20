export const parseDescription = (description: OA3.Description | undefined) => {
  if (!Array.isArray(description)) return description

  return (description.filter(Boolean) as string[])
    .map((item, index) => {
      if (index === 0) return item // don't add line break before the first item
      return item.trim().startsWith(`-`) ? `\n${item}` : `\n\n${item}`
    })
    .join(``)
}

export const mergeDescription = (
  desc: OA3.Description | undefined,
  additionalDesc: OA3.Description,
) => {
  if (!desc) return parseDescription(additionalDesc)

  return parseDescription([
    ...(Array.isArray(desc) ? desc : [desc]),
    ...(Array.isArray(additionalDesc) ? additionalDesc : [additionalDesc]),
  ])
}
