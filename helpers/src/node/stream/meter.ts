/**
 * @note based on @see https://github.com/brycebaril/node-stream-meter
 */
import stream from "node:stream"

/**
 * Triggers callback if stream passes through more than @see maxBytes
 */
export class Meter extends stream.Transform {
  public bytes: number
  public maxBytes: number
  public errorMsgOnExceed: string
  public constructor(maxBytes: number, msg?: string) {
    super()
    this.bytes = 0
    this.maxBytes = maxBytes || Number.MAX_VALUE
    this.errorMsgOnExceed =
      msg || `Stream exceeded specified max of ${this.maxBytes} bytes`
  }

  public _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    cb: stream.TransformCallback,
  ) {
    this.bytes += chunk.length
    this.push(chunk)
    if (this.bytes >= this.maxBytes) {
      return cb(new Error(this.errorMsgOnExceed))
    }
    cb()
  }
}
