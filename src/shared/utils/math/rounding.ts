


// Rounds half up to +Inf
// Rounds using toFixed
// Scale must be 0..100
export const rf = (n: number, scale = 0): number => +n.toFixed(scale)
export const rf5 = (n: number) => rf(n, 5)



export const floorTo0 = (n: number) => n > 0 ? Math.floor(n) : n < 0 ? -Math.floor(-n) : n
