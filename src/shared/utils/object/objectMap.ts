import type { ObjectEntry, ObjectValue } from '@@/utils/object/objectTypes.ts'



export function objectMapValues<const O1 extends object, const O2 extends object>(
  object: O1,
  mapper: (value: ObjectValue<O1>, object: O1) => ObjectValue<O2>
): O2 {
  // @ts-expect-error
  return Object.fromEntries(Object.entries(object)
    .map(([key, value]) => [key, mapper(value, object)])
  )
}

export function objectMap<const O1 extends object, const O2 extends object>(
  object: O1,
  mapper: (entry: ObjectEntry<O1>, object: O1) => ObjectEntry<O2>
): O2 {
  // @ts-expect-error
  return Object.fromEntries(Object.entries(object)
    .map(entry => mapper(entry, object))
  )
}

