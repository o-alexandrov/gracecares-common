import { EnvProps, getProcessEnv } from "./get-process-env"

export const getProcessEnvForBundling = async (props: EnvProps) => {
  const values = await getProcessEnv(props)
  type valuesModified = {
    [key in `process.env.${keyof typeof values}`]: string
  }
  const valuesModified = {} as valuesModified
  for (const key of Object.keys(values)) {
    valuesModified[`process.env.${key}`] = JSON.stringify(values[key]) // in bundling, we need to apply falsy values to enable "tree-shaking"
  }
  return valuesModified
}

export const setProcessEnvForCLI = async (props: EnvProps) => {
  const values = await getProcessEnv(props)
  for (const key of Object.keys(values) as string[]) {
    process.env[key] = values[key] || ``
  }
}
