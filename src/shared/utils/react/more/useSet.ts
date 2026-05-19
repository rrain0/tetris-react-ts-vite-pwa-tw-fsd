import { setOf } from '@@/utils/js/factory.ts'
import { useRefGetSetInit } from '@@/utils/react/state/useRefGetSetInit.ts'
import { type ValueOrProducer } from '@@/utils/ts/ts.ts'



export function useSet<V>(initialData?: ValueOrProducer<Set<V>>) {
  const [getAll, setAll] = useRefGetSetInit<Set<V>>(initialData ?? setOf)
  
  const add = (value: V) => getAll().add(value)
  const remove = (value: V) => getAll().delete(value)
  const has = (value: V) => getAll().has(value)
  
  const clear = () => getAll().clear()
  
  return { add, remove, has, clear, getAll, setAll }
}
