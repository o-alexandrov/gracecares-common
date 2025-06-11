/**
 * Retries a function with exponential backoff
 *
 * @param maxRetries integer representing the maximum number of retries
 * @param firstRetryDelay integer representing the delay in milliseconds before the first retry
 * @param fn function to retry on error
 * @returns result of the function
 */
export const retryExponentialBackoff = async (
  maxRetries: number,
  firstRetryDelay: number,
  fn: () => any,
  checkShouldRetry?: (error: unknown) => boolean,
) => {
  let retries = 0
  const retry = async () => {
    try {
      return fn()
    } catch (error) {
      if (retries >= maxRetries) throw error
      const shouldRetry = checkShouldRetry ? checkShouldRetry(error) : true
      if (!shouldRetry) throw error

      if (process.env.AWS_STAGE !== `production`) {
        console.error(
          `Retrying (${retries + 1}/${maxRetries}) after error:`,
          error,
        )
      }

      retries++
      await new Promise((resolve) =>
        setTimeout(resolve, firstRetryDelay * 2 ** retries),
      )
      return retry()
    }
  }
  return retry()
}
