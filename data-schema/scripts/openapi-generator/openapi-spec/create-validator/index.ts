// import fs from "node:fs/promises"

// import * as commonHelpers from "@gracecares-ai/helpers"
// import toJsonSchema from "@openapi-contrib/openapi-schema-to-json-schema"
// import Ajv from "ajv"
// import standaloneCode from "ajv/dist/standalone"
// import ajvFormats from "ajv-formats"
// import ajvKeywords from "ajv-keywords"
// import * as migrate from "json-schema-migrate"

// import { responseMimeType } from "../response-mime-type"
// import { filterSchema } from "./filter-schema"

// export const createValidator = async (
//   outputFile: string,
//   definition: OA3.OperationObject,
// ): Promise<void | undefined> => {
//   if (!definition.requestBody) {
//     await fs.rm(outputFile, { force: true })
//     return
//   }

//   const requestBody = definition.requestBody as OA3.RequestBodyObject
//   const schemaRaw = commonHelpers.cloneDeep(
//     requestBody.content[responseMimeType].schema,
//   )!
//   filterSchema(schemaRaw)

//   try {
//     const schema = toJsonSchema(schemaRaw, {
//       strictMode: true,
//     })

//     /**
//      * "ajv" doesn't support JSON Schema Draft 4
//      *   - so we convert Draft 4 to Draft 7
//      */
//     migrate.draft7(schema)

//     /**
//      * Including "ajv" within the function's scope is an attempt not to depend on "ajv"'s cache
//      */
//     const ajv = new Ajv({
//       $data: false, // @see https://ajv.js.org/options.html#data
//       passContext: false, // @see https://ajv.js.org/options.html#passcontext
//       messages: false, // removes additional error info @see https://ajv.js.org/options.html#messages
//       // discriminator: true,

//       validateSchema: true,
//       strict: `log`,
//       // strictTypes: `log`,
//       useDefaults: true,
//       /**
//        * @default removes all additional (unexpected) properties
//        * @see https://ajv.js.org/options.html#removeadditional
//        *
//        * IMPORTANT: false prevents property deletion during anyOf/oneOf validation
//        * which was causing premature removal of properties required by other schemas.
//        * 'failing' still removes properties after validation fails, which breaks anyOf.
//        */
//       removeAdditional: false,
//       code: { esm: true, lines: true, source: true },
//     })

//     /**
//      * When defining an OpenAPI spec, you can use any of the additional "ajv" keywords
//      * @see https://ajv.js.org/packages/ajv-keywords.html#keywords
//      */
//     ajvKeywords(ajv)
//     /**
//      * When defining an OpenAPI spec, you can use any of the additional "ajv" formats
//      * @see https://ajv.js.org/guide/formats.html
//      */
//     ajvFormats(ajv)

//     const validate = ajv.compile(schema, false)
//     let codeRaw = standaloneCode(ajv, validate)

//     /**
//      * Replace the "require" statements with "import" statements
//      * @see https://github.com/ajv-validator/ajv-formats/pull/73#issuecomment-1553180608
//      */
//     const codeArr = codeRaw.split(`;`)
//     const mapAjvFormats = new Map<number, string>()
//     const mapAjvTransform = new Map<number, string>()

//     codeArr.forEach((item, idx) => {
//       if (item.includes(`require("ajv-formats/dist/formats")`)) {
//         return mapAjvFormats.set(idx, item)
//       }
//       if (item.includes(`require("ajv-keywords/dist/definitions/transform")`)) {
//         return mapAjvTransform.set(idx, item)
//       }
//     })

//     mapAjvFormats.forEach((value, key) => {
//       const varDeclaration = /const formats\d+/.exec(value)![0]
//       const name = /fullFormats\.(.*)/.exec(value)![1]
//       codeArr[key] = `${varDeclaration} = fullFormats["${name}"]`
//     })
//     mapAjvTransform.forEach((value, key) => {
//       const varDeclaration = /const func\d+/.exec(value)![0]
//       const name = /transform\.(.*)/.exec(value)![1]
//       codeArr[key] = `${varDeclaration} = transformDef.transform["${name}"]`
//     })
//     if (mapAjvFormats.size) {
//       const idx = mapAjvFormats.keys().next().value!
//       codeArr[idx] =
//         `import { fullFormats } from "ajv-formats/src/formats";${codeArr[idx]}`
//     }
//     if (mapAjvTransform.size) {
//       const idx = mapAjvTransform.keys().next().value!
//       codeArr[idx] =
//         `import transformDef from "ajv-keywords/dist/definitions/transform";${codeArr[idx]}`
//     }
//     codeRaw = codeArr.join(`;`)
//     /**
//      * End of "require" statements replacement
//      */

//     // if (schema.oneOf || schema.anyOf) {
//     //   const regex = /if\(errors === 0\)(?:.|\n)*false;\n\}\n\}/
//     //   const isMatch = regex.exec(codeRaw)
//     //   if (!isMatch) throw new Error(`missing statement`)
//     //   codeRaw = codeRaw.replace(regex, ``)
//     // }

//     const code = commonHelpers.getBannerToDisableLinters() + codeRaw

//     await fs.writeFile(outputFile, code)
//   } catch (error) {
//     console.log(
//       `Failed to create validator for "${outputFile.replace(`validator.js`, `ts`)}"`,
//       `\nrequest schema:`,
//     )
//     console.dir(schemaRaw, { depth: null })

//     throw error
//   }
// }
