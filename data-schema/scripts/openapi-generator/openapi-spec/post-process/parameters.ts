import { getDefinition } from "./attribute/get-definition"

export const parameters = (
  pathDefinition: OA3.Path,
): OA3.OperationObject["parameters"] => {
  const parameters: OA3.OperationObject["parameters"] = []
  const { pathParameters, queryParameters } = pathDefinition

  if (pathParameters) {
    for (const key of Object.keys(pathParameters)) {
      const definition = getDefinition(key, pathParameters[key] as any)
      parameters.push({
        name: pathParameters[key]!.name || key,
        in: `path`,
        required: true,
        schema: definition as OA3.SchemaObject,
      })
    }
  }

  if (queryParameters) {
    for (const key of Object.keys(queryParameters)) {
      const definition = getDefinition(key, queryParameters[key] as any)
      parameters.push({
        name: queryParameters[key]!.name || key,
        in: `query`,
        schema: definition as OA3.SchemaObject,
        ...(queryParameters[key]!.required && { required: true }),
      })
    }
  }

  return parameters
}
