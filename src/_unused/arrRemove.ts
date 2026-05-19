

export function arrRemove<T>(arr: T[], elem: T): T[] {
  const i = arr.findIndex(it => it === elem)
  if (i !== -1) arr.splice(i, 1)
  return arr
}
