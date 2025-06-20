export const numRange = (min: number, max: number): DataSchema.Validation[] => {
  return [
    {
      msg: `Please enter a number between ${min} and ${max}`,
      exp: (newValue) => {
        if (Number(newValue) > max || Number(newValue) < min) return false
        return true
      },
    },
  ]
}
