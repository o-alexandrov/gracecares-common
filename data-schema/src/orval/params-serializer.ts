export const queryString = (paramsRaw: Record<string, any> | Falsy): string => {
  if (!paramsRaw) return ``

  const params = { ...paramsRaw }
  for (const key of Object.keys(params)) {
    if (params[key] === undefined) delete params[key]
  }
  const queryString = new URLSearchParams(params).toString() // can be empty if `paramsRaw` is an empty object
  return queryString && `?${queryString}`
}
