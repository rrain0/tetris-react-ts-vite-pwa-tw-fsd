import { mapOf } from '@@/utils/js/factory.ts'
import { useRefGetSetInit } from '@@/utils/react/state/useRefGetSetInit.ts'
import { isundef, type ValueOrProducer } from '@@/utils/ts/ts.ts'



// set(undefined) removes entry from object
export function useMap<K, V>(initialData?: ValueOrProducer<Map<K, V>>) {
  const [getMap, setMap] = useRefGetSetInit<Map<K, V>>(initialData ?? mapOf)
  
  const get = (key: K) => getMap().get(key)
  const set = (key: K, value?: V) => {
    if (isundef(value)) getMap().delete(key)
    else getMap().set(key, value)
  }
  const has = (key: K) => getMap().has(key)
  
  return [
    get, set, has,
    getMap, setMap,
  ] as const
}
