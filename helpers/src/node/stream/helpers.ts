import stream from "node:stream"

export const errorHandler = (err: unknown) => {
  throw err
}

export const cloneReadable = (readableStream: stream.Readable) => {
  const clonedStream = new stream.PassThrough()

  readableStream.on(`data`, (chunk) => {
    clonedStream.push(chunk)
  })

  readableStream.on(`end`, () => {
    clonedStream.push(null)
  })

  return clonedStream
}

export const cloneReadableWithSize = (readableStream: stream.Readable) => {
  type clonedStream = stream.PassThrough & {
    streamSize: number
  }
  const clonedStream = new stream.PassThrough() as clonedStream

  clonedStream.streamSize = 0
  readableStream.on(`data`, (chunk: Buffer) => {
    clonedStream.streamSize += chunk.length
    clonedStream.push(chunk)
  })

  readableStream.on(`end`, () => {
    clonedStream.push(null)
  })

  return clonedStream
}

export const getBufferFromOutput = async (
  output: stream.PassThrough | stream.Readable,
) =>
  new Promise<Buffer>((resolve, reject) => {
    const outputToBuffer = cloneReadable(output)
    const bufferChunks: any[] = []

    outputToBuffer.on(`error`, reject)
    outputToBuffer.on(`data`, (chunk) => {
      bufferChunks.push(chunk)
    })
    outputToBuffer.on(`end`, () => {
      resolve(Buffer.concat(bufferChunks))
    })
  })
