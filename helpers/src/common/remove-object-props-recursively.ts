import { cloneDeep } from "./lodash-alternatives/clone-deep"

type PropsToRemove =
  | string
  | (string | ((obj: Record<string, any>) => string))[]

const recursiveRemoval = (
  obj: Record<string, any>,
  properties: PropsToRemove,
) => {
  // Remove the specified properties from the current object
  for (const prop of properties) {
    let key = prop as string
    if (typeof prop === `function`) key = prop(obj)
    delete obj[key]
  }

  // Recursively process nested objects and arrays
  for (const value of Object.values(obj)) {
    if (value && typeof value === `object`) {
      if (Array.isArray(value)) {
        // Handle arrays - recursively process each element
        for (const item of value) {
          if (item && typeof item === `object` && !Array.isArray(item)) {
            recursiveRemoval(item, properties)
          }
        }
      } else {
        recursiveRemoval(value, properties) // Handle nested objects
      }
    }
  }
}

/**
 * Recursively removes specified properties from an object.
 * @param obj The object to modify.
 * @param properties The properties to remove.
 */
export const removeObjectPropsRecursively = (
  obj: Record<string, any>,
  properties: PropsToRemove,
) => {
  const propsToRemove = Array.isArray(properties) ? properties : [properties]
  const clonedObj = cloneDeep(obj)
  recursiveRemoval(clonedObj, propsToRemove)
  return clonedObj
}
