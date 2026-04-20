import type {
  ObjectEntries,
  ObjectFromEntriesArr,
  ObjectValues,
} from '@@/utils/object/objectTypes.ts'



declare global {
  interface ObjectConstructor {
    
    values<O extends object>(object: O): ObjectValues<O>
    
    entries<O extends object>(object: O): ObjectEntries<O>
    
    fromEntries<
      E extends readonly (readonly [PropertyKey, any])[]
    >(entries: E): ObjectFromEntriesArr<E>
    
  }
}
