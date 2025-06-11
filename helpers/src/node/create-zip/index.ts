/**
 * @notes
 *   - "zip.js" creates bigger files than "adm-zip", and more complex to use
 */
import admZip from "adm-zip"

/**
 * Change the compression method of all entries @see https://github.com/cthackers/adm-zip/issues/187#issuecomment-490166400
 * @param method - compression 0 (no compression) or 8 (max compression)
 */
const setGlobalMethod = (zip: admZip, method: 0 | 8) => {
  for (const entry of zip.getEntries()) entry.header.method = method
}

export interface createZip {
  files?: Parameters<admZip[`addLocalFile`]>[]
  folders?: Parameters<admZip[`addLocalFolder`]>[]
  /** use to add files from memory */
  virtualFiles?: Parameters<admZip[`addFile`]>[]
  level?: 0 | 8
}
/**
 * Creates a zip file using adm-zip
 *
 * @param props - files and folders to add to the zip file
 * @returns adm-zip instance you could in the following ways:
const zip = await createZip(...)

// case 1 - get "Buffer" of a zip file
const buffer = await zip.toBufferPromise() 

// case 2 - write the zip file to disk
await zip.writeZipPromise("path/to/zip/file.zip")
 */
export const createZip = (props: createZip) => {
  const zip = new admZip()
  for (const fileArgs of props.files || []) {
    zip.addLocalFile(...fileArgs)
  }
  for (const folderArgs of props.folders || []) {
    zip.addLocalFolder(...folderArgs)
  }
  for (const args of props.virtualFiles || []) {
    zip.addFile(...args)
  }
  setGlobalMethod(zip, props.level || 8)
  return zip
}
