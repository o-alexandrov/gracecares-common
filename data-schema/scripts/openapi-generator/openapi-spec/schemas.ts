import * as attr from "@gracecares-ai/data-schema/src/schemas/attribute"
import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import type * as TF from "type-fest"

import * as postProcess from "./post-process"

type attribute = TF.MergeExclusive<
  { definition: OA3.Attribute },
  { variants: OA3.Variants }
> & {
  name: string
}

const schemasRaw: {
  [schema: string]: OA3.Attribute | OA3.SchemaObject
} = {}

const mapAttributes = new Map<string, attribute & { key: string }>()
// Generate OpenAPI spec's schemas for attributes
for (const key of Object.keys(attr)) {
  const attribute = attr[key] as attribute

  if (!attribute.name)
    throw new Error(`Attribute does NOT have a "name" exported variable`)
  /**
   * Check duplicate attribute names
   */
  if (mapAttributes.has(attribute.name)) {
    console.log(`Another attribute`)
    console.dir(mapAttributes.get(attribute.name), { depth: null })
    console.log(`This attribute`)
    console.dir(Object.assign({ key }, attribute), { depth: null }) // we use Object.assign to unwrap the object; see https://stackoverflow.com/a/44634156
    throw new Error(`Attribute "${attribute.name}" is NOT unique`)
  }
  mapAttributes.set(attribute.name, { ...attribute, key })

  if (!attribute.definition && !attribute.variants) {
    throw new Error(
      // @ts-expect-error TypeScript thinks ".name" must always exist, but we must have a runtime check to ensure it does
      `Attribute "${attribute.name}" does NOT have either "definition" or "variants" exported variables`,
    )
  }
  if (attribute.definition && attribute.variants) {
    throw new Error(
      // @ts-expect-error TypeScript thinks ".name" doesn't exist in this case because it conflicts with typings; we must have a runtime check to ensure this case doesn't happen
      `Attribute "${attribute.name}" must NOT export both "definition" and "variants" at the same time`,
    )
  }

  if (attribute.definition) {
    // Generate operation context for attribute definitions to enable union schema registration
    const operationContext =
      attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1)
    schemasRaw[attribute.name] = postProcess.schema(
      attribute.definition as any,
      { operationContext },
    )
    continue
  }

  if (attribute.variants) {
    for (const variant of Object.keys(attribute.variants)) {
      const name = `${attribute.name}_${variant}`
      // Generate operation context for attribute variants to enable union schema registration
      const operationContext = `${attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1)}${variant.charAt(0).toUpperCase() + variant.slice(1)}`
      schemasRaw[name] = postProcess.schema(
        attribute.variants[variant] as any,
        { operationContext },
      )
    }
  }
}

const processItemObject = (
  itemDefinition: any,
  description?: string,
  title?: string,
  operationContext?: string,
) => {
  // Handle items that have anyOf at the top level
  if (itemDefinition.anyOf) {
    return {
      ...(title && { title }),
      ...postProcess.schema(itemDefinition, {
        operationContext,
      }),
      ...(description && {
        description: postProcess.parseDescription(description),
      }),
    }
  }

  // Handle items that have properties directly
  return {
    ...(title && { title }),
    ...(postProcess.processObject(
      {
        type: `object`,
        properties: itemDefinition,
      },
      { operationContext },
    ) as OA3.SchemaObject),
    ...(description && {
      description: postProcess.parseDescription(description),
    }),
  }
}

// Generate OpenAPI spec's schemas for items
for (const key of Object.keys(items)) {
  const item = items[key]
  if (!item.definition) {
    throw new Error(`Item "${key}" must have a "definition" exported variable`)
  }

  const name = `item_${key}`
  // Generate operation context for meaningful anyOf schema names
  const operationContext = `Item${key.charAt(0).toUpperCase() + key.slice(1)}`

  schemasRaw[name] = processItemObject(
    item.definition,
    (item as { description?: string }).description,
    undefined, // title
    operationContext,
  )
}

export const schemas = schemasRaw
