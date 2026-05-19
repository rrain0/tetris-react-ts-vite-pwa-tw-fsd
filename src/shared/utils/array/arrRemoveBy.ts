


export type ArrFilter<T> = (v: T, i: number, arr: T[]) => any

export function arrRemoveBy<T>(arr: T[], filter: NoInfer<ArrFilter<T>>): T[] {
  const i = arr.findIndex(filter)
  if (i !== -1) arr.splice(i, 1)
  return arr
}
