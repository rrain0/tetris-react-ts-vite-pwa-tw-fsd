export { }
import type {
  ObjectEntriesSimple,
  ObjectFromEntriesArr, ObjectKeys,
  ObjectValues,
} from '@@/utils/object/objectTypes.ts'



declare global {
  interface ObjectConstructor {
    
    keys<O extends object>(object: O): ObjectKeys<O>;
    
    values<O extends object>(object: O): ObjectValues<O>
    
    entries<O extends object>(object: O): ObjectEntriesSimple<O>
    
    fromEntries<
      E extends readonly (readonly [PropertyKey, any])[]
    >(entries: E): ObjectFromEntriesArr<E>
    
  }
}
