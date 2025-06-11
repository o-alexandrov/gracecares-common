import http from "node:http"

import * as StatusCodes from "http-status-codes"

/**
 * Check whether URL responds with 200 (OK) status code.
 *   @example to check whether file exists
 */
export const httpCheckOriginOk = async (url: `http://${string}`) => {
  return new Promise((resolve) => {
    http
      .request(url, { method: `HEAD` }, (res) => {
        console.info(`res.statusCode`, res.statusCode)
        resolve(res.statusCode === StatusCodes.OK)
      })
      .on(`error`, () => {
        resolve(false)
      })
      .end()
  })
}
