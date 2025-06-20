import type * as TF from "type-fest"

/** URL-safe and not used in our backend-generated random identifiers (ids) */
export const separatorComplexAttribute = `:`
const doubleSeparatorComplexAttribute = `${separatorComplexAttribute}${separatorComplexAttribute}`

type Param = string | number

export const getComplexAttribute = <Value extends string>(
  complexAttributeValue: Value,
) => {
  const hasDoubleSeparator = complexAttributeValue.includes(
    doubleSeparatorComplexAttribute,
  )
  const parsed = complexAttributeValue.split(
    hasDoubleSeparator
      ? doubleSeparatorComplexAttribute
      : separatorComplexAttribute,
  ) as TF.Split<Value, typeof separatorComplexAttribute>
  type V = typeof parsed

  return parsed as unknown as V extends [infer A]
    ? string[]
    : V extends [infer A, infer B]
      ? [`${V[0]}`, string?]
      : V extends [infer A, infer B, infer C]
        ? [`${V[0]}`, string?, string?]
        : V extends [infer A, infer B, infer C, infer D]
          ? [`${V[0]}`, string?, string?, string?]
          : V extends [infer A, infer B, infer C, infer D, infer E]
            ? [`${V[0]}`, string?, string?, string?, string?]
            : string[]
  /**
   * @todo in the future, experiment with passing CONFIG to TF.Split
   * const result = getComplexAttribute<[userID: string, createdAt: number]>(`a:1`)
   * // resulting type should be: [string, `${number}` | undefined]
   *
   */
  // const parsed = complexAttributeValue.split(
  //   separatorComplexAttribute,
  // ) as TF.Split<typeof complexAttributeValue, typeof separatorComplexAttribute>
}

/**
 * We use complex attributes to store multiple values in a single attribute for data modeling purposes
 * Can join either primitive values or 1-level complex attributes
@example Case 1 (joining primitive values with optional undefined):
```ts
const complexAttribute = setComplexAttribute(`a`, `b`, 1, 2, 3, undefined)
// complexAttribute = `a:b:1:2:3`
```

@example Case 2 (joining complex attributes):
```ts
const complexAttribute = setComplexAttribute(
  1,
  `c:d:4:5:6`,
)
// complexAttribute = `1::c:d:4:5:6` // notice double separator between 1 and c
 */
export const setComplexAttribute = <
  V extends (Param | false | null | undefined)[],
>(
  ...values: V // do not enforce 2 or more values using typings (it worsens DX)
) => {
  if (process.env.AWS_STAGE !== `production`) {
    if (values.length < 2) {
      throw new Error(`You must pass at least 2 parameters`)
    }

    for (const value of values) {
      if (typeof value !== `string`) continue
      if (value.includes(doubleSeparatorComplexAttribute)) {
        throw new Error(
          `You cannot use a 2-level deep complex attribute in "setComplexAttribute" as it results in inability to parse the value.`,
        )
      }
    }
  }

  const filtered = values.filter((v) => Boolean(v) || v === 0) // keeps: all truthy values (string) AND 0

  const hasComplexAttribute = filtered.some(
    (v) => typeof v === `string` && v.includes(separatorComplexAttribute), // checks whether one of the values is already a complex attribute
  )

  return filtered.join(
    hasComplexAttribute
      ? doubleSeparatorComplexAttribute
      : separatorComplexAttribute,
  ) as TF.Join<
    /** @todo remove nullish types from V[number], the following line doesn't work (the return becomes "string") */
    // V extends (infer U | false | null | undefined)[] ? U[] : V,
    V,
    typeof separatorComplexAttribute
  >
}
