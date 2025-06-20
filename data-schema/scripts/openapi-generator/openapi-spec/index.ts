import * as env from "@gracecares-ai/env"
import * as envHelpers from "@gracecares-ai/env/src/helpers"

import { getPathsAndTags } from "./paths"
import { getUnionSchemas } from "./post-process/schema"
import { schemas } from "./schemas"
import { jwt, securitySchemes } from "./security-schemes"

const defaultApiVersion = `1.0.0`
const openApiVersion = `3.1.0`

const getServer = (stage: envHelpers.stage): OA3.ServerObject => ({
  url: `${env.protocol}${envHelpers.getDomain(stage)}`, // shouldn't have a trailing slash, IBM's validator complains otherwise
  description: `Stage \`${stage}\``,
})
/**
 * @see https://swagger.io/specification/#openapi-object
 */
export const getOpenApiSpec = async () => {
  const { paths, tags } = await getPathsAndTags()

  return {
    /**
     * `redoc` has some issues, mentioned here
     *   - @see https://github.com/Redocly/redoc/issues/1715
     */
    openapi: openApiVersion, // versions list @see https://github.com/OAI/OpenAPI-Specification/releases
    servers: [getServer(`develop`)],
    security: [jwt],
    // servers: Object.keys(envHelpers.awsAccountsIds).map(getServer),
    // externalDocs: {
    // description: `Click to download OpenAPI v${openApiVersion} spec as JSON`,
    // url: `${defaultDocsUrl}/spec.json`,
    // },
    /**
     * This data ends up in the generated ".ts" files; must have static values (stage irrelevant)
     */
    info: {
      title: `${envHelpers.productionDomain} API`,
      version: defaultApiVersion,
      description: `RESTful service for ${envHelpers.productionDomain} website`,
      contact: { email: `support@${envHelpers.productionDomain}` },
    },
    /**
     * Official doc @see https://swagger.io/docs/specification/components/
     *
     * Notable articles:
     *   - Thorough guide on "components" @see https://idratherbewriting.com/learnapidoc/pubapis_openapi_step5_components_object.html
     *   - Quick overview @see https://blog.stoplight.io/reuse-openapi-descriptions
     */
    components: {
      securitySchemes,
      schemas: Object.fromEntries(
        Object.entries({
          ...(schemas as OA3.ComponentsObject[`schemas`]),
          ...getUnionSchemas(), // add union schemas to the components.schemas
        }).sort((a, b) => a[0].localeCompare(b[0])),
      ), // sort schemas by name to make it easier to find them in the generated spec
    },
    paths,
    tags, // tags are used as "groups" of paths (to add a description to the group)
    // "x-tagGroups": [
    //   {
    //     name: `Attributes`,
    //     tags: schemas.tags.map((v) => v.name),
    //   },
    // ],
  } satisfies OA3.OpenAPIObject
}
