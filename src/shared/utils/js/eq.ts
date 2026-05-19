


export type EqualityChecker<A, B = A> = (a: A, b: B) => boolean



export const eqAny: EqualityChecker<any> = (a, b) => a === b

export function eqAsJson(obj1: any, obj2: any) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}
