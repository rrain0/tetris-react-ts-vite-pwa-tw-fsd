


export const compareAny = (a: any, b: any) => a > b ? 1 : a < b ? -1 : 0
export const compareAnyReversed = (a: any, b: any) => compareAny(b, a)

export function compareNumbers(a: number, b: number) {
  const aNan = Number.isNaN(a), bNan = Number.isNaN(b)
  if (aNan && bNan) return 0
  if (aNan) return -1
  if (bNan) return 1
  return compareAny(a, b)
}
