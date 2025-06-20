import * as attr from "@gracecares-ai/data-schema/src/schemas/attribute"
import * as commonHelpers from "@gracecares-ai/helpers"

import { parseDescription } from "../description"

export const getDefinition = (
  name: OA3.attribute,
  attributeProps: OA3.attributeProps,
): OA3.Attribute => {
  let definition: OA3.Attribute | undefined
  try {
    const attribute = attr[name] as OA3.attributeConfig

    definition = attribute.variants
      ? attribute.variants[(attributeProps as any).variant!]
      : attribute.definition

    if (attribute.variants && !definition) {
      throw new Error(
        `Variant "${(attributeProps as any).variant}" not found for attribute "${name}". Available variants: ${Object.keys(attribute.variants).join(`,`)}`,
      )
    }

    const copyDefinition = commonHelpers.cloneDeep(definition)

    if (attributeProps.exampleOverride) {
      copyDefinition.example = attributeProps.exampleOverride
    }

    copyDefinition.description = parseDescription(copyDefinition.description)

    return copyDefinition
  } catch (error) {
    console.info(
      `\nFailed attribute name: "${name}"\n`,
      attributeProps,
      `\n`,
      definition,
    )
    if (definition) console.info(`\nDefinition:`, definition)
    throw error
  }
}
