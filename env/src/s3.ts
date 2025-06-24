// Cover
export const mimeTypes = [
  `image/jpg`,
  `image/jpeg`,
  `image/png`,
  `image/webp`,
  `image/avif`,
]

export const s3PrefixTemp = `temp`
export const s3BucketTemp =
  `${s3PrefixTemp}${process.env.AWS_ACCOUNT_ID}` as const

export const s3PrefixMediaRaw = `media-raw`
export const s3BucketMediaRaw =
  `${s3PrefixMediaRaw}${process.env.AWS_ACCOUNT_ID}` as const
/**
 * AWS S3 buckets we have
 */
export type S3BucketName = typeof s3BucketMediaRaw | typeof s3BucketTemp

export const maxSizeUnknownFile = 524288000 // 500MB
