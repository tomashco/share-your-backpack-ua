export const getSelectItems = (array, keyValue) => {
  let supportList: string[] = []
  return array.reduce((arr, el) => {
    if (el[keyValue] && !supportList.includes(el[keyValue])) {
      supportList.push(el[keyValue]) // prevent duplicated values
      arr.push({ [keyValue]: el[keyValue] })
      return arr
    }
    return arr
  }, [])
}

enum weightConversion {
  g = 1,
  kg = 0.001,
  lb = 0.00220462,
  oz = 0.035274,
}

export const convertWeight = (weight: number | null | undefined, localUnit: string) =>
  Math.round(((weight || 0) * weightConversion[localUnit] + Number.EPSILON) * 100) / 100
