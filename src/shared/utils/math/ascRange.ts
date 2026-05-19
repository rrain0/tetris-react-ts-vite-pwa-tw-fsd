

// from - value >= start
// after - value > start
// to - value <= end
// until - value < end

// TODO range
export function ascRngHasFromUntil(v: number, from: number, until: number) {
  return v >= from && v < until
}
