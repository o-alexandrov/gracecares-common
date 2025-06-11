interface getBannerToDisableLinters {
  disableAutogenerationNote?: true
}

/**
 * @returns string of comments to disable linters
 */
export const getBannerToDisableLinters = (
  props: getBannerToDisableLinters = {},
) =>
  [
    ...(props.disableAutogenerationNote
      ? []
      : [
          `/** @WARNING this file is auto-generated. Do NOT edit it manually */`,
        ]),
    `/* eslint-disable */`, // disable ESLint, it must come before TypeScript, as ESLint has rules that prohibit adding a comment to disable a type check
    `// @ts-nocheck`, // disable type checking
    `/* @noformat */`, // disable Prettier and other formatters
    ``, // extra empty line
  ].join(`\n`)
