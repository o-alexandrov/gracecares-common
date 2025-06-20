import * as StatusCodes from "http-status-codes"

import { responseMimeType } from "../response-mime-type"
import { schema } from "./schema"

type StatusCodes = typeof StatusCodes
type StatusCodesNames = Exclude<
  keyof StatusCodes,
  `getStatusText` | `getStatusCode`
>

type StatusCodesNamesGlobalAuth = `UNAUTHORIZED` | `FORBIDDEN`
type StatusCodesNamesGlobalLambdaHttpTryCatch =
  | `NOT_IMPLEMENTED`
  | `SERVICE_UNAVAILABLE`
type StatusCodesNamesGlobalRequestValidationError = `UNPROCESSABLE_ENTITY`
/**
 * @IMPORTANT These status codes are used globally, so DO NOT document use of global codes in the local logic of the API endpoints
 * Otherwise, we won't be able to distinguish between the global and local errors
 *
 * ## Use global codes in the local logic, only if the local error is EXACTLY the same as the global error
 * @example you can return "UNAUTHORIZED" in the local logic, if the local error is exactly about the user not being authorized (and the check must be done in the local logic also)
 */
type StatusCodesNamesGlobal =
  | StatusCodesNamesGlobalAuth
  | StatusCodesNamesGlobalLambdaHttpTryCatch
  | StatusCodesNamesGlobalRequestValidationError

type StatusCodeNamesWOGloballyUsed = Exclude<
  StatusCodesNames,
  StatusCodesNamesGlobal
>
export type StatusCodesNumbersWOGloballyUsed =
  StatusCodes[StatusCodeNamesWOGloballyUsed]

export const responses = (
  responses: OA3.Path[`responses`],
  operationContext?: string,
) => {
  const keys = Object.keys(responses) as string[]
  const responsesModified = {} as {
    [key in StatusCodesNumbersWOGloballyUsed]: OA3.Object
  }
  for (const key of keys) {
    if (responsesModified[key]) throw new Error(`Duplicate status code: ${key}`)

    let description: string | undefined
    try {
      description =
        responses[key].description || StatusCodes.getStatusText(Number(key))
    } catch {} // eslint-disable-line no-empty

    responsesModified[key] = {
      ...(description && { description }),
      ...(responses[key].schema && {
        content: {
          [responseMimeType]: {
            schema: schema(responses[key].schema, {
              operationContext: operationContext,
            }),
          },
        },
      }),
    }
  }

  return responsesModified
}
