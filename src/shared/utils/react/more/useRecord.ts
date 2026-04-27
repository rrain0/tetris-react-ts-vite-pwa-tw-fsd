import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { isundef, type RecordOpt } from '@@/utils/ts/ts.ts'



// set(undefined) removes entry from object
export function useRecord<K extends keyof any, V>(initialData?: RecordOpt<K, V>) {
  const [getRecord, setRecord] = useRefGetSet<RecordOpt<K, V>>(initialData ?? { })
  
  const get = (key: K) => getRecord()[key]
  const set = (key: K, value?: V) => {
    if (isundef(value)) delete getRecord()[key]
    else getRecord()[key] = value
  }
  const has = (key: K) => key in getRecord()
  
  return [
    get, set, has,
    getRecord, setRecord,
  ] as const
}
