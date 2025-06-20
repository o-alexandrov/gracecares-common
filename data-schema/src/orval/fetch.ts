import * as env from "@gracecares-ai/env"
import * as StatusCodes from "http-status-codes"

const getResponse = (pathname: string, props: req) => {
  const configuration: RequestInit = { method: props.method || `POST` }

  if (props.protected) {
    const jwtToken = localStorage.getItem(`token`)
    if (!jwtToken) {
      return new Response(null, { status: StatusCodes.UNAUTHORIZED })
    }
    configuration.headers = { Authorization: jwtToken }
  }

  if (props.data) {
    /**
     * @IMPORTANT "content-type" header is OPTIONAL
     */
    configuration.body =
      typeof props.data === `object`
        ? JSON.stringify(props.data) // JSON.stringify will remove "undefined" values @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description
        : props.data
  }

  return fetch(`${env.endpointAPI}${pathname}`, configuration)
}
/**
 * These global variables exist to change the behavior of the app
 * These variables are NOT suitable for process.env overrides
 */
declare global {
  interface Window {
    /**
     * Sometimes, we might want to forcefully show loading state (ex. in Storybook)
     */
    FORCE_LOADING: boolean
  }
}

interface req {
  /** methods must be uppercase (at least `PATCH`) @see https://github.com/github/fetch/issues/254
   * @default `POST` */
  method?: `GET` | `PUT` | `DELETE` | `PATCH`
  data?: any
  mime?: `text`
  protected?: boolean
}

interface config {
  callbackAfterResponse: (response: Response, responseBody: string) => void
}
export const config: config = {
  callbackAfterResponse: () => {},
}

export const req = async <T>(pathname: string, props: req): Promise<T> => {
  if (process.env.CDD || process.env.TEST) {
    if (window.FORCE_LOADING) {
      await new Promise((resolve) => setTimeout(resolve, 10000000)) // never resolve
    }
    return undefined as never
  }

  const response = await getResponse(pathname, props)

  const responseBody = await response.text()
  config.callbackAfterResponse(response, responseBody)

  // @ts-expect-error TS has an issue interpreting possible T typings
  if (!responseBody) return

  switch (props.mime) {
    case `text`:
      return responseBody as unknown as T
  }

  return JSON.parse(responseBody) as unknown as T
}
