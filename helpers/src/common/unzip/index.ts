import type { ZipEntry } from "unzipit"
import { unzip as unzipit } from "unzipit"

interface ResponseItem {
  /** file name */
  name: string
  /**
   * The value of a file entry in the zip file
   * If you pass "handlerEntry", you can change it to "arrayBuffer", "text", or "json"
   * @default Blob */
  value: Blob
}

export const unzip = async (
  src: Parameters<typeof unzipit>[0],
  handlerEntry?: (entry: ZipEntry) => `text` | `json` | `arrayBuffer` | `blob`,
) => {
  const zipInfo = await unzipit(src)

  const processResponseItem = async (
    responseItem: ResponseItem,
    entry: ZipEntry,
  ) => {
    const fnToUse = handlerEntry?.(entry) || `blob`
    const value = await entry[fnToUse]()
    responseItem.value = value
  }

  const response: ResponseItem[] = []
  const promises: Promise<void>[] = []
  for (const [name, entry] of Object.entries(zipInfo.entries)) {
    if (entry.isDirectory) continue // skip directories; files within directories are separate entries (i.e. nested files are correctly processed)

    const responseItem = { name: name } as ResponseItem
    promises.push(processResponseItem(responseItem, entry))
    response.push(responseItem)
  }
  await Promise.all(promises)
  return response
}
