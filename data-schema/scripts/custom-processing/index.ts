import { getDefinition } from "../openapi-generator/openapi-spec/post-process/attribute/get-definition"
import { schema } from "../openapi-generator/openapi-spec/post-process/schema"
import { writeFile } from "./write-file"

const names = {}
type namesType = keyof typeof names

const capitalizeFirstLetter = (v: string) => v[0].toUpperCase() + v.slice(1)

const createFileWithNames = async (type: namesType) => {
  const namesList: string[] = []
  for (const account of Object.keys(names[type])) {
    // @ts-expect-error "names" is currently empty
    const name = names[type][account].name
    namesList.push(name)
  }
  const typeCapitalFirstLetter = capitalizeFirstLetter(type)

  const dataToWrite = [
    `export const names${typeCapitalFirstLetter} = [\n  ${namesList
      .map((v) => `\`${v}\``)
      .join(`,\n  `)}\n] as const`,
    `export type names${typeCapitalFirstLetter} = typeof names${typeCapitalFirstLetter}`,
    `export type name${typeCapitalFirstLetter} = names${typeCapitalFirstLetter}[number]`,
  ].join(`\n`)
  return writeFile(type, dataToWrite)
}

const createFileWithRegexes = async (attributes: OA3.Properties) => {
  const dataToWrite: string[] = []

  for (const attributeName of Object.keys(attributes)) {
    const definition = schema(
      getDefinition(attributeName, attributes[attributeName] as any) as any,
    )
    if (!definition.pattern) throw new Error(`${attributeName} has no pattern`)

    const nameCapitalFirstLetter = capitalizeFirstLetter(attributeName)
    dataToWrite.push(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `export const regex${nameCapitalFirstLetter} = ${new RegExp(
        definition.pattern,
      )}`,
    )
  }
  return writeFile(`regex`, dataToWrite.join(`\n`))
}

export const runCustomProcessing = async () => {
  return Promise.all([
    // @ts-expect-error "names" is currently empty
    ...Object.keys(names).map(createFileWithNames),
    createFileWithRegexes({
      email: {},
      id: {},
    }),
  ])
}
