/**
 * Converts a value to a pretty-printed (with 2 spaces) JSON string
 */
export const prettyPrint = (value: any) => JSON.stringify(value, null, 2)
