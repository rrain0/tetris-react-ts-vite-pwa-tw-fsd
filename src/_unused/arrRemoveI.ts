


export function arrRemoveI<T>(arr: T[], i = arr.length - 1): T[] {
  arr.splice(i, 1)
  return arr
}
