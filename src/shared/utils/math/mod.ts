


/**
 * Modulo (mod): ((a % b) + b) % b
 * Не путать с Reminder (rem): a % b
 * mod(2, 8) => 2
 * mod(-2, 8) => 6
 * mod(10, 8) => 2
 * mod(-10, 8) => 6 ( то есть 8 * 2 + (-10) )
 */
export const mod = (a: number, b: number): number => ((a % b) + b) % b
