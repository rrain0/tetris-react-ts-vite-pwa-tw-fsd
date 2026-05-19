import { ifNaN } from '@@/utils/ts/ts.ts'



export type num2 = [number, number]



export function rangeHas(v: number, [from, to]: num2): boolean {
  return (
    // check for ascending range
    v >= from && v <= to ||
    // check for descending range
    v <= from && v >= to
  )
}



export function rangeMap(v: number, fromRange: num2, toRange: num2): number {
  // works for both asc & desc ranges
  const vIn0To1 = ifNaN((v - fromRange[0]) / (fromRange[1] - fromRange[0]), 0)
  // works for both asc & desc ranges
  return vIn0To1 * (toRange[1] - toRange[0]) + toRange[0]
}



// ✅ Не требует округлений результата
export function rangeClamp(v: number, [from, to]: num2): number {
  if (from > to) [from, to] = [to, from]
  return v < from ? from : v > to ? to : v
}



export function rangeMapClamp(
  v: number,
  fromRange: num2,
  toRange: num2,
  clampTo: num2 = toRange
): number  {
  return rangeClamp(rangeMap(v, fromRange, toRange), clampTo)
}
