

export type Comparator<T> = (a: T, b: T) => 1 | 0 | -1



export const compareAny: Comparator<any> = (a, b) => a > b ? 1 : a < b ? -1 : 0
export const compareAnyReversed: Comparator<any> = (a, b) => compareAny(b, a)



export const compareNumbers: Comparator<number> = (a, b) => {
  const aNan = Number.isNaN(a), bNan = Number.isNaN(b)
  if (aNan && bNan) return 0
  if (aNan) return -1
  if (bNan) return 1
  return compareAny(a, b)
}
