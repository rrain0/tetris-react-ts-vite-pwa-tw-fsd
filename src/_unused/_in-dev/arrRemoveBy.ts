


namespace Test1 {
  export type ArrFilter<T> = (v: T, i: number, arr: T[]) => any
  
  export function arrRemoveBy<T, A extends T[] | undefined>(
    arr: A, filter: NoInfer<ArrFilter<T>>
  ): A {
    if (!arr) return undefined as A
    const i = arr.findIndex(filter)
    if (i !== -1) arr.splice(i, 1)
    return arr
  }
  
  
  
  
  const arr: number[] = [0]
  const arrU: undefined = undefined
  
  const arr2 = arrRemoveBy(arr, v => !!v)
  const arrU2 = arrRemoveBy(arrU, v => !!v)
}

namespace Test2 {
  export type ArrFilter<T> = (v: T, i: number, arr: T[]) => any
  
  export function arrRemoveBy<T>(
    arr: T[] | undefined, filter: NoInfer<ArrFilter<T>>
  ): typeof arr extends undefined ? undefined : T[] {
    // @ts-expect-error
    if (!arr) return undefined
    const i = arr.findIndex(filter)
    if (i !== -1) arr.splice(i, 1)
    return arr
  }
  
  
  
  
  const arr: number[] = [0]
  const arrU: undefined = undefined
  
  const arr2 = arrRemoveBy(arr, v => !!v)
  const arrU2 = arrRemoveBy(arrU, v => !!v)
}