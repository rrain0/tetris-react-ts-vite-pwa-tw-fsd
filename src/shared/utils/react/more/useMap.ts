import { mapOf } from '@@/utils/js/factory.ts'
import { useRefGetSetInit } from '@@/utils/react/state/useRefGetSetInit.ts'
import { isundef, type ValueOrProducer } from '@@/utils/ts/ts.ts'



export function useMap<K, V>(initialData?: ValueOrProducer<Map<K, V>>) {
  const [getAll, setAll] = useRefGetSetInit<Map<K, V>>(initialData ?? mapOf)
  
  const get = (key: K) => getAll().get(key)
  // set(undefined) removes entry from map
  const set = (key: K, value?: V) => {
    if (isundef(value)) getAll().delete(key)
    else getAll().set(key, value)
  }
  const has = (key: K) => getAll().has(key)
  
  const clear = () => getAll().clear()
  
  return { get, set, has, clear, getAll, setAll }
}
