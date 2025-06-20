import { responseMimeType } from "../response-mime-type"
import { schema } from "./schema"

export const requestBody = (
  requestBody: NonNullable<OA3.Path[`requestBody`]>,
  operationContext?: string,
): OA3.OperationObject[`requestBody`] => ({
  required: true,
  content: {
    [responseMimeType]: {
      schema: schema(
        (requestBody.anyOf
          ? { anyOf: requestBody.anyOf.map((v) => ({ ...v, type: `object` })) }
          : { ...requestBody, type: `object` }) as OA3.ResponseSchema,
        {
          isRequestBody: true,
          operationContext,
        },
      ),
    },
  },
})
