export const notLessThan = (value: number): DataSchema.Validation[] => {
  return [
    {
      msg: `Amount should not be less than ${value}`,
      exp: (newValue) => {
        if (Number(newValue) < value) return false
        return true
      },
    },
  ]
}
