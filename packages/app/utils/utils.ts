export const getSelectItems = (array, keyValue) => {
  let supportList: string[] = []
  return array.reduce((arr, el) => {
    if (el[keyValue] && !supportList.includes(el[keyValue])) {
      supportList.push(el[keyValue]) // prevent duplicated values
      arr.push({ name: el[keyValue] })
      return arr
    }
    return arr
  }, [])
}
