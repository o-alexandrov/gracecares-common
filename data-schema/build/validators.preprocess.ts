/**
 * Preprocessing functions for zod validation; "value" is undefined if it's "optional" and not provided
 */
export const trim = (value: any) => value?.trim()
export const trimAndLowerCase = (value: any) => value?.trim().toLowerCase()
export const trimAndUpperCase = (value: any) => value?.trim().toUpperCase()
