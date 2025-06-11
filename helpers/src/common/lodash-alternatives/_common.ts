export const getPathAsArray = (path: string) =>
  path.split(/[[\].]+/).filter(Boolean)
