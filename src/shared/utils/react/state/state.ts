import type { nullish } from '@@/utils/ts/ts.ts'



export const setOf = <T>(values?: Iterable<T> | nullish) => new Set<T>(values)
