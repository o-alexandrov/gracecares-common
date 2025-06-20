const routeRegExps: DataSchema.ValidationRegExp[] = [
  {
    msg: `Must NOT have more than 1 consecutive slash`,
    exp: /\/{2,}/,
  },
  {
    msg: `Has invalid characters. Must include only a-z 0-9 _ - {} /`,
    exp: /[^-_a-z\d{}/]/,
  },
  {
    msg: `Path parameters must have only a-z 0-9 or underscore _ characters`,
    exp: /\{[^a-z\d_]+\}/,
  },
]

export const checkIsValidRouteFilename = (file: string, route: string) => {
  for (const config of routeRegExps) {
    const isInvalid = config.exp.test(route)

    if (isInvalid) {
      throw new Error(
        `Invalid route: "${route}"\n${config.msg}\nFilename:\n${file}\n`,
      )
    }
  }
}
