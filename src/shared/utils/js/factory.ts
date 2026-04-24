


export const setFrom = <T>(values?: Iterable<T> | null) => new Set<T>(values)
export const setOf = <T>(...values: T[]) => new Set<T>(values)

type EntryRo<K, V> = readonly [K, V]
export const mapFrom = <K, V>(entries?: readonly EntryRo<K, V>[] | null) => new Map<K, V>(entries)
export const mapOf = <K, V>(...entries: EntryRo<K, V>[]) => new Map<K, V>(entries)
