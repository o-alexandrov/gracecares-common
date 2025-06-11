import type * as TF from "type-fest"
/**
 * Get timestamp in seconds (current time in seconds)
 *
 * Sometimes we might want to create multiple timestamps of a certain time
 *   - in this case, we pass @param ms
 *
 * @example when we create multiple timestamps of a certain time
 *   // this example avoids a case when the timestamp is on the verge of next period in one of the timestamps
 *   const time = Date.now()
 *   const timestampInSeconds = getTimestampInSeconds(time)
 *   const timestampInHours = getTimestampInHours(time)
 */
export const getTimestampInSeconds = (ms?: number) =>
  Math.floor((ms || Date.now()) / 1000)

/**
 * Get timestamp in hours (current time in hours)
 * @IMPORTANT to keep parameter in seconds, as most of our timestamps in the database are stored in seconds
 */
export const getTimestampInHours = (seconds?: number) =>
  Math.floor((seconds || getTimestampInSeconds()) / 3600)

export type Timestamp = TF.RequireExactlyOne<{
  seconds: number
  hours: number
  days: number
}>
export const convertToTimestampInSeconds = (
  timestamp: Timestamp, // @ts-expect-error TypeScript doesn't understand (infer) that all cases of "timestamp" are covered (returned)
): number => {
  if (timestamp.hours) return timestamp.hours * 3600
  if (timestamp.days) return timestamp.days * 86400
  if (timestamp.seconds) return timestamp.seconds
  if (process.env.NODE_ENV === `development`) {
    throw new Error(`Timestamp is not provided`)
  }
}
