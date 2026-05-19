


export type ObjectKey<O extends object> = keyof O
export type ObjectValue<O extends object> = O[keyof O]
export type ObjectEntry<O extends object> = { [Prop in keyof O]: [Prop, O[Prop]] }[keyof O]



export type ObjectKeys<O extends object> = ObjectKey<O>[]
export type ObjectValues<O extends object> = ObjectValue<O>[]
export type ObjectEntries<O extends object> = ObjectEntry<O>[]



export type ObjectEntrySimple<O extends object> = [keyof O, O[keyof O]]



export type ObjectEntriesSimple<O extends object> = ObjectEntrySimple<O>[]



export type ObjectFromEntriesArr<A extends readonly (readonly [PropertyKey, any])[]> = {
  [E in A[number] as E[0]]: E[1]
}

export type ObjectFromEntriesArrPrecise<
  E extends readonly (readonly [PropertyKey, any])[],
  O extends { } = { },
> = (
  E extends readonly [
    readonly [infer Key extends PropertyKey, infer Value],
    ...infer Rest extends readonly any[]
  ]
    ? ObjectFromEntriesArrPrecise<Rest, O & { [Prop in Key]: Value }>
    : O
)
