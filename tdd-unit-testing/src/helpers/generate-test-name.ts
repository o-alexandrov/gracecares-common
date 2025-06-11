import path from "node:path"

export const getTitleApiRest = (fileUrl: string) => {
  const [method] = fileUrl.split(path.sep).pop()!.split(`.`)
  const pathToFile = decodeURIComponent(
    fileUrl.split(`handlers${path.sep}http`)[1],
  )

  return `${method.toUpperCase()} ${pathToFile}`
}

const getTitle = (fileUrl: string, splitBy: string) => {
  const pathToFile = decodeURIComponent(fileUrl.split(splitBy)[1])
  return pathToFile.substring(1)
}

export const getTitleSrc = (v: string) => getTitle(v, `src`)
