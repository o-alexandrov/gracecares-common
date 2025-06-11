import { constants } from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"

/**
 * Checking for file existence is a bad practice before copying.
 * This method is to copy only if a file does not exist.
 */
export const copyIfNew = async (
  src: Parameters<typeof fs.copyFile>[0],
  dest: Parameters<typeof fs.copyFile>[1],
) => fs.copyFile(src, dest, constants.COPYFILE_EXCL)

/**
 * By default @see copyIfNew will throw an error if the file already exists.
 * This method would not throw an error if the file already exists.
 */
export const copyIfNewNoErrors: typeof copyIfNew = async (src, dest) =>
  copyIfNew(src, dest).catch(() => {})

/**
 * Checking for file existence is a bad practice before writing.
 * This method is to write only if a file does not exist.
 */
export const writeIfNew = async (
  file: Parameters<typeof fs.writeFile>[0],
  data: Parameters<typeof fs.writeFile>[1],
  options?: Omit<Parameters<typeof fs.writeFile>[2], `flag`>,
) => fs.writeFile(file, data, { flag: `wx`, ...options }) // `wx` flag means: if a file already exists, it will throw an error

export const writeForce = async (
  file: Parameters<typeof fs.writeFile>[0],
  data: Parameters<typeof fs.writeFile>[1],
  options?: Omit<Parameters<typeof fs.writeFile>[2], `flag`>,
) => {
  const dir = path.dirname(file as string)
  await fs.mkdir(dir, { recursive: true })
  return fs.writeFile(file, data, { flag: `w`, ...options }) // `w` flag means: if a file doesn't exist, it will be created
}

/**
 * By default @see writeIfNew will throw an error if the file already exists.
 * This method would not throw an error if the file already exists.
 */
export const writeIfNewNoErrors: typeof writeIfNew = async (
  file,
  data,
  options,
) => writeIfNew(file, data, options).catch(() => {})

export const checkExists = async (path: Parameters<typeof fs.stat>[0]) =>
  fs.stat(path).catch(() => false)

export const mkDirNoErrors = async (
  path: Parameters<typeof fs.mkdir>[0],
  options?: Parameters<typeof fs.mkdir>[1],
) => fs.mkdir(path, options).catch(() => {})

export const readdirOnlyDirectories = async (readPath: string) => {
  try {
    const files = await fs.readdir(readPath, { withFileTypes: true })
    return files.filter((v) => v.isDirectory()).map((v) => v.name)
  } catch {
    return []
  }
}
