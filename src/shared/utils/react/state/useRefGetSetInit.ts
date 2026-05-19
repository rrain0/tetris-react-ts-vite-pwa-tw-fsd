import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { isfunction, type Producer } from '@@/utils/ts/ts.ts'



export function useRefGetSetInit<T>(initialValue: T | Producer<T>) {
  const [getInited, setInited] = useRefGetSet(false)
  function init(): T {
    // @ts-ignore
    if (getInited()) return
    else {
      setInited(true)
      if (isfunction(initialValue)) return initialValue()
      else return initialValue
    }
  }
  return useRefGetSet<T>(init())
}
