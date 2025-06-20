import * as tdd from "@gracecares-ai/tdd-unit-testing"

import { enumOrObjectToOpenapi } from "./index"

describe(tdd.getTitleSrc(import.meta.url), () => {
  it(`obj`, () => {
    const schema = enumOrObjectToOpenapi(`obj`, {
      uploaded: 0,
      error: 7,
      draft: 9,
    })
    expect(schema).toEqual({
      title: `obj`,
      type: `number`,
      enum: [0, 7, 9],
      description: [
        `obj:`,
        `- \`0\` (uploaded)`,
        `- \`7\` (error)`,
        `- \`9\` (draft)`,
      ],
    })
  })

  it(`objMixedValues`, () => {
    expect(() =>
      enumOrObjectToOpenapi(`objMixedValues`, {
        uploaded: 0,
        error: `error`,
      }),
    ).toThrow(
      `object "objMixedValues" has values of different types (expecting all "number")`,
    )
  })

  it(`objMultipleSameValues`, () => {
    expect(() =>
      enumOrObjectToOpenapi(`objMultipleSameValues`, {
        key1: `same`,
        key2: `same`,
      }),
    ).toThrow(`"objMultipleSameValues" has a duplicate value "same"`)
  })

  it(`enumFixedValues`, () => {
    enum enumFixedValues {
      uploaded = 0,
      error = 7,
      draft = 9,
    }

    const schema = enumOrObjectToOpenapi(`enumFixedValues`, enumFixedValues)
    expect(schema).toEqual({
      title: `enumFixedValues`,
      type: `number`,
      enum: [0, 7, 9],
      description: [
        `enumFixedValues:`,
        `- \`0\` (uploaded)`,
        `- \`7\` (error)`,
        `- \`9\` (draft)`,
      ],
    })
  })

  it(`enumGeneratedValues`, () => {
    enum enumGeneratedValues {
      zero,
      one,
      two,
    }

    const schema = enumOrObjectToOpenapi(
      `enumGeneratedValues`,
      enumGeneratedValues,
    )
    expect(schema).toEqual({
      title: `enumGeneratedValues`,
      type: `number`,
      enum: [0, 1, 2],
      description: [
        `enumGeneratedValues:`,
        `- \`0\` (zero)`,
        `- \`1\` (one)`,
        `- \`2\` (two)`,
      ],
    })
  })

  it(`enumOneFixedValue`, () => {
    enum enumOneFixedValue {
      zero,
      one = 1,
      two,
    }

    const schema = enumOrObjectToOpenapi(`enumOneFixedValue`, enumOneFixedValue)
    expect(schema).toEqual({
      title: `enumOneFixedValue`,
      type: `number`,
      enum: [0, 1, 2],
      description: [
        `enumOneFixedValue:`,
        `- \`0\` (zero)`,
        `- \`1\` (one)`,
        `- \`2\` (two)`,
      ],
    })
  })

  it(`enumStrings`, () => {
    enum enumStrings {
      some = `zero`,
      one = `one`,
      two = `two`,
    }

    const schema = enumOrObjectToOpenapi(`enumStrings`, enumStrings)
    expect(schema).toEqual({
      title: `enumStrings`,
      type: `string`,
      enum: [`zero`, `one`, `two`],
      description: [
        `enumStrings:`,
        `- \`zero\` (some)`,
        `- \`one\``,
        `- \`two\``,
      ],
    })
  })

  it(`enumMixedValues`, () => {
    enum enumMixedValues {
      number = 0,
      string = `one`, // eslint-disable-line @typescript-eslint/no-mixed-enums
    }

    expect(() =>
      enumOrObjectToOpenapi(`enumMixedValues`, enumMixedValues),
    ).toThrow(
      `enum "enumMixedValues" has mixed types. It must be all numbers or all strings`,
    )
  })
})
