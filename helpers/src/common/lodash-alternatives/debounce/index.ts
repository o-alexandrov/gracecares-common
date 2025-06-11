import { dequal } from "dequal/lite"

import { cloneDeep } from "../clone-deep"
/**
 * Creates a debounced function that
 * 1. Invokes `callback` immediately
 * 2. Waits `wait` milliseconds before invoking `callback` again
 *   - if `callback` is invoked again before `wait` milliseconds have elapsed, the timer is reset
 * 3. After `wait` milliseconds, it checks if the arguments have changed
 *   - if the arguments have changed, it invokes `callback` again
 *   - if the arguments have not changed, it does NOT invoke `callback` again
 *
 * For details over the differences between `debounce` `throttle` @see https://css-tricks.com/debouncing-throttling-explained-examples
 *
 * Note: this function intentially does NOT pass `this` or `arguments` to the callback
 *   - please do NOT depend on `this` or `arguments` in your code
 *
 * @param callback function to be called after the `wait` time
 * @param wait number of milliseconds to wait before calling the callback
 */
export const debounce = (callback: (...args: any[]) => any, wait: number) => {
  let timeout: NodeJS.Timeout | undefined
  let lastArgs: any[] | undefined

  return async (...args) => {
    let response: Promise<any> | undefined

    if (!timeout) {
      lastArgs = cloneDeep(args)
      response = callback(...args)
    }
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      const isSameArgs = dequal(args, lastArgs)

      timeout = undefined
      lastArgs = undefined

      if (isSameArgs) return

      callback(...args)
    }, wait)

    return response
  }
}
