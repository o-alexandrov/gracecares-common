import path from "node:path"

import { root as pathRepoRoot } from "@gracecares-ai/data-schema/scripts/paths"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as StatusCodes from "http-status-codes"

import * as postProcess from "../post-process"
import { responseMimeType } from "../response-mime-type"
import type { HandlerProps } from "./get-handlers-props"
import { getHandlersProps } from "./get-handlers-props"

const fileToDebug = undefined
// `v1/order/reviews/{seller}/{created_product}/get.ts`

export const pathBase = path.resolve(pathRepoRoot, `src`, `paths`)
const pathsRaw: OA3.PathsObject = {}

const processPathFile = async (props: HandlerProps) => {
  /**
   * Uncomment, if you want to debug a specific file
   */
  if (fileToDebug && !props.file.includes(fileToDebug)) return // skip other files

  const fileContent = await import(props.file)
  if (!fileContent.definition)
    throw new Error(`"${props.file}" has no definition`)
  const definitionRaw = fileContent.definition as OA3.Path
  const definition = definitionRaw as unknown as OA3.OperationObject

  const [version, rootRoutePathName] = props.route
    .replace(/^\/+/, ``)
    .split(`/`) // ex. "art"

  // Generate operation context for meaningful oneOf schema names
  const operationContext = `${props.method.charAt(0).toUpperCase() + props.method.slice(1)}${props.route
    .replace(/^\/+/, ``)
    .replace(/[{}]/g, ``) // Remove path parameter braces
    .split(`/`)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(``)}`

  if (pathsRaw[props.route]?.[props.method]) {
    throw new Error(`"${props.route}" has duplicate "${props.method}" methods`)
  }

  if (definitionRaw.requestBody) {
    definition.requestBody = postProcess.requestBody(
      definitionRaw.requestBody,
      operationContext,
    )
  }

  if (definitionRaw.pathParameters || definitionRaw.queryParameters) {
    definition.parameters = postProcess.parameters(definitionRaw)
    delete definitionRaw.pathParameters
    delete definitionRaw.queryParameters
  }

  pathsRaw[props.route] = {
    ...pathsRaw[props.route],
    [props.method]: {
      tags: [rootRoutePathName],
      ...(!props.hasAuthorization && { security: [{}] }),
      ...definition,
      description: postProcess.parseDescription(definition.description),
      responses: {
        ...(props.hasAuthorization && {
          [StatusCodes.UNAUTHORIZED]: {
            description: `The requester is not authorized to access the resource`,
          },
          [StatusCodes.FORBIDDEN]: {
            description: `The requester is not authorized to access the resource`,
          },
        }),
        [StatusCodes.NOT_IMPLEMENTED]: {
          description: `All errors without a dedicated status code`,
          content: {
            [responseMimeType]: {
              schema: {
                type: `string`,
                example: `Malformed JSON`,
                description: `Explanation what happened`,
              },
            },
          },
        },
        ...(definition.requestBody &&
          postProcess.responses(
            {
              [StatusCodes.UNPROCESSABLE_ENTITY as 200]: {
                description: `Validation error. Response contains path in OpenAPI spec to follow`,
                schema: {
                  type: `object`,
                  // see: https://zod.dev/error-customization
                  _dangerousUndocumentedProperties: {
                    expected: {
                      required: true,
                      type: `string`,
                      description: ``,
                      example: ``,
                    },
                    code: {
                      required: true,
                      type: `string`,
                      description: ``,
                      example: ``,
                    },
                    message: {
                      required: true,
                      type: `string`,
                      description: ``,
                      example: ``,
                    },
                  },
                },
              },
            },
            operationContext,
          )),
        ...postProcess.responses(definitionRaw.responses, operationContext),
      },
    },
  }
}

const getSorted = (arr: string[]) => arr.sort((a, b) => a.localeCompare(b))

const getTags = async () => {
  const pathTags = path.join(pathBase, `v1`)
  const directories = await commonHelpers.readdirOnlyDirectories(pathTags)
  const tags: OA3.TagObject[] = []
  const processTag = async (dirName: string, index: number) => {
    const pathTagDescription = path.join(pathTags, dirName, `description.ts`)
    const { description } = await import(pathTagDescription).catch(() => ({}))
    if (
      description &&
      typeof description !== `string` &&
      !Array.isArray(description)
    ) {
      throw new Error(
        `In file: ${pathTagDescription}\n` +
          `description must be either: string | string[], but got "${typeof description}"`,
      )
    }
    // do NOT use ".push" to avoid inconsistent order
    tags[index] = {
      name: dirName,
      description: postProcess.parseDescription(description),
    }
  }

  await Promise.all(directories.map(processTag))
  return tags
}

export const getPathsAndTags = async () => {
  const [handlerProps, tags] = await Promise.all([
    getHandlersProps(pathBase),
    getTags(),
  ])
  await Promise.all(handlerProps.map(processPathFile))

  /**
   * @IMPORTANT to sort paths after the async processing, as async processing won't guarantee the order
   */
  const sortedPaths = {}
  for (const path of getSorted(Object.keys(pathsRaw))) {
    for (const method of getSorted(Object.keys(pathsRaw[path]))) {
      sortedPaths[path] = {
        ...sortedPaths[path],
        [method]: pathsRaw[path][method],
      }
    }
  }
  return { paths: sortedPaths, tags }
}
