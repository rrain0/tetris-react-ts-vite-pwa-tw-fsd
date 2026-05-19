


// ℹ️ Primitive shortcuts

export type nullish = null | undefined
export type anyval = {} | null | undefined

export type anyfun = (...args: any[]) => any
export type Fun<A extends any[] = any[], R = any> = (...args: A) => R

export type falsy = false | undefined | null | '' | 0 | 0n

export type objectkey = keyof any // string | number | symbol




// ℹ️ Value modifiers

export type Nonnullishval<T> = T & {}
export type DefinedVal<T> = Exclude<T, undefined>




// ℹ️ Object modifiers

// +partial +undefined
export type Opt<O extends object> = {
  [Prop in keyof O]+?: O[Prop] | undefined
}
// -partial -undefined
export type Defined<O extends object> = {
  [Prop in keyof O]-?: DefinedVal<O[Prop]>
}
// +partial -undefined
export type PartDefined<O extends object> = {
  [Prop in keyof O]+?: DefinedVal<O[Prop]>
}
// +readonly
export type Ro<O extends object> = {
  +readonly [Prop in keyof O]: O[Prop]
}
// +readonly +partial +undefined
export type OptRo<O extends object> = {
  +readonly [Prop in keyof O]+?: O[Prop] | undefined
}
// -readonly +partial
export type WriteablePart<O extends object> = {
  -readonly [Prop in keyof O]+?: O[Prop]
}

// Make props in O optional if they appear in Defaults
export type PartialDefaults<O extends object = object, Defaults extends Partial<O> = Partial<O>> =
  & Omit<O, keyof Defaults>
  & { [DProp in keyof Defaults & keyof O]?: O[DProp] }
// Make all properties to be defined or all to be absent or undefined
export type AllOrNone<O extends object> = O | {
  [Prop in keyof O]?: undefined
}
// for provided keys +partial +undefined
export type OptKeys<O extends object, OptK extends keyof O> =
  & { [Prop in Exclude<keyof O, OptK>]: O[Prop] }
  & { [Prop in OptK]+?: O[Prop] | undefined }




// ℹ️ Records

// +partial
export type RecordPart<K extends keyof any, T> = {
  [P in K]+?: T
}
// +undefined
export type RecordUndef<K extends keyof any, T> = {
  [P in K]: T | undefined
}
// +partial +undefined
export type RecordOpt<K extends keyof any, T> = {
  [P in K]+?: T | undefined
}
// +readonly
export type RecordRo<K extends keyof any, T> = {
  +readonly [P in K]: T
}




// ℹ️ Object unions


// В TypeScript параметры функций находятся в контрвариантной позиции.
// Когда мы заставляем TypeScript сопоставить несколько функцийс разными аргументами
// в одну (infer I), он вынужден создать пересечение (&) этих аргументов,
// чтобы обеспечить безопасность типов.
export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

// Makes optional props in one object to be opt or undef in another object
export type ObjectSymmetricUnion<O1 extends object, O2 extends object> =
  | O1 & { [OptKeys in keyof Omit<O2, keyof O1>]?: undefined }
  | O2 & { [OptKeys in keyof Omit<O1, keyof O2>]?: undefined }

// Makes union of 2 objects + shallow unions of shared props
// ⚠️ It is impossible to make conditional optionality for value union
export type ObjectShallowPropsUnion<O1 extends object, O2 extends object> =
  & Omit<O1, keyof O2>
  & Omit<O2, keyof O1>
  & { [P in keyof O2 & keyof O1]?: O1[P] | O2[P] }



// Test
{
  interface OriginalType {
    requiredKey: string;
    optionalKey?: number;
    anotherRequired: boolean;
    anotherOptional?: string;
  }
  
  // Define the keys you want to exclude
  type KeysToExclude = 'requiredKey' | 'anotherOptional'
  
  // Create the new type using Omit
  type ExcludedType = Omit<OriginalType, KeysToExclude>
  
  /*
   ExcludedType is effectively:
   {
   optionalKey?: number;
   anotherRequired: boolean;
   }
   */
  
  const validObject1: ExcludedType = {
    // requiredKey is excluded
    //optionalKey: 123,
    anotherRequired: true,
    // anotherOptional is excluded
  }
  
  const validObject2: ExcludedType = {
    // optionalKey can be absent
    anotherRequired: false, // anotherRequired is still mandatory
  }
  
  // @ts-expect-error: Property 'anotherRequired' is missing in type
  const invalidObject: ExcludedType = {
    optionalKey: 456,
  }
}



// ℹ️ Проверка типа через typeof

export type Isobject<T> = T extends object ? T extends anyfun ? never : T : never

// Value is undefined
export function isundef<T>(value: T | undefined): value is undefined {
  return value === undefined
}
// Value is defined
export function isdef<T>(value: T | undefined): value is T {
  return value !== undefined
}
// Value is null
export function isnull<T>(value: T | null): value is null {
  return value === null
}
// Value is not null
export function isnotnull<T>(value: T | null): value is T {
  return value !== null
}
export function isnotnullish<E extends {}, T>(value: T | E): value is E {
  return value !== null && value !== undefined
}
export function isnullish<NE extends nullish, T>(value: T | NE): value is NE {
  return value === null || value === undefined
}
export function isbool<B extends boolean, T>(value: T | B): value is B {
  return typeof value === 'boolean'
}
export function isstring<S extends string, T>(value: T | S): value is S {
  return typeof value === 'string'
}
export function isnumber<N extends number, T>(value: T | N): value is N {
  return typeof value === 'number'
}
// Value is number or string
export function isnumstr<V extends number | string, T>(value: T | V): value is V {
  return typeof value === 'number' || typeof value === 'string'
}
// Value is object (and not function & not null)
export function isobject<T>(value: T): value is Isobject<T> {
  return typeof value === 'object' && value !== null
}
export function isfunction<F extends Function, T>(value: T | F): value is F {
  return typeof value === 'function'
}
export function assertNever(value: never): never {
  throw new Error(
    `This code must not be reached because value must be never, but it is: ${value}`
  )
}
export function assertNeverTrue(value: false): never {
  throw new Error(
    `This code must not be reached because value must be false, but it is: ${value}`
  )
}



// ℹ️ Object type predicates
// Checks type through 'instanceof'

export function isObject<O extends object, T>(value: T | O): value is O {
  return value instanceof Object
}
export function isArray<A extends any[], T>(value: T | A): value is A {
  return value instanceof Array
}
export function isFunction<F extends Function, T>(value: T | F): value is F {
  return value instanceof Function
}
export function isRecord<R extends object, T>(value: R | any[] | anyfun | T): value is R {
  return isObject(value) && !isArray(value) && !isFunction(value)
}



// ℹ️ Number checks

export function isFinitenumber<N extends number, T>(v: T | N): v is N {
  return Number.isFinite(v) // internally checks typeof v === 'number'
}
export function isInt<N extends number, T>(v: T | N): v is N {
  return Number.isInteger(v) // internally checks typeof v === 'number'
}



// ℹ️ Function types

export type Cb = () => void
export type Cb1<T> = (value: T) => void
export type Cb2<T1, T2> = (value1: T1, value2: T2) => void
export type CbN<T extends any[]> = (...args: T) => void
export type Setter<T> = Cb1<T>
export type Consumer<T> = Cb1<T>
export type EvCb<T> = (ev: T) => void
export type Getter<T> = () => T
export type Producer<T> = Getter<T>
export type Mapper<In, Out = In> = (v: In) => Out
export type Mapper2<In1, In2, Out = In1> = (a: In1, b: In2) => Out
export type MapperN<Ins extends any[], Out> = (...values: Ins) => Out

export type Predicate<T> = (v: T) => boolean
export const tobool: Predicate<any> = value => !!value
export type Filter<T> = (v: T) => any
export const defaultFilter: Filter<any> = tobool

export type Combiner<T1, T2 = T1> = (a: T1, b: T2) => T1
export type CombinerIndexed<T1, T2 = T1> = (a: T1, b: T2, aI: number, bI: number) => T1
export type Merger<T1, T2 = T1> = (a: T1, b: T2) => [T1, T2]
export type MergerIndexed<T1, T2 = T1> = (a: T1, b: T2, aI: number, bI: number) => [T1, T2]

export type ValueOrMapper<T> = T | Mapper<T>
export type ValueOrProducer<T> = T | Producer<T>
export type Updater<T> = (mapper: Mapper<T>) => void
export type SetterOrUpdater<T> = (valueOrMapper: T | Mapper<T>) => void

export type FunOrObj<F extends anyfun> = (
  F extends (...args: infer A) => infer R ? ((...args: A) => R) | R : never
)




// ℹ️ Value mappers

// By default false is mapped to undefined
export function ifBool<V, const TV>(
  v: V | true, trueV: TV
): V | TV
export function ifBool<V, const TV>(
  v: V | true | false, trueV: TV
): V | TV | undefined
export function ifBool<V, const TV, const FV>(
  v: V | boolean, trueV: TV, falseV: FV
): V | TV | FV
export function ifBool<V, const TV, const FV>(
  v: V | boolean, trueV: TV, falseV?: FV
): V | TV | FV | undefined {
  if (v === true) return trueV
  if (v === false) return falseV
  return v
}


export function ifVal<V, const IFV, const THENV>(
  value: V | IFV, ifValue: IFV, thenValue: THENV
): V | THENV {
  if (value === ifValue) return thenValue
  return value as V
}


export const ifdef = <V, R>(v: V | undefined, mapper: Mapper<V, R>) => isdef(v) ? mapper(v) : v
export const ifNaN = <R = number>(n: number, r: R) => isNaN(n) ? r : n
export const ifNotnumber = <T, R>(v: T, r: R) => isnumber(v) ? v : r
export const ifNotnumberOrNaN = <T, R>(v: T, r: R) => isnumber(v) && !isNaN(v)? v : r
export const ifNotnumberOrNegative = <T, R>(v: T, r: R) => isnumber(v) && v >= 0 ? v : r
export const ifNotnumberOrNotNull = <T, R>(v: T, r: R) => isnumber(v) && v === null ? v : r
export const ifNotNonNegInt = (v: any, r: number): number => {
  v = +v
  if (isNaN(v) || v < 0 || !Number.isInteger(v)) v = r
  return v
}





// ℹ️ Playground to test ideas

namespace TypeUtilsTest {
  
  
  // Получить тип, в котором ко всем именам свойств переданного объекта добавляется суффикс
  export type Suffix<O extends object, Suff extends string> = (
    { [Prop in keyof O as Prop extends string ? `${Prop}${Suff}` : never]: O[Prop] }
  )
  
  
  // First, define a type that, when passed a union of keys, creates an object which
  // cannot have those properties. I couldn't find a way to use this type directly,
  // but it can be used with the below type.
  export type Impossible<K extends keyof any> = { [P in K]: never }
  
  
  // The secret sauce! Provide it the type that contains only the properties you want,
  // and then a type that extends that type, based on what the caller provided
  // using generics.
  export type NoExtraProperties<T, U extends T = T> = U & Impossible<Exclude<keyof U, keyof T>>
  
  
}

