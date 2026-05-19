import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import type { Cb1 } from '@@/utils/ts/ts.ts'



export function useRefGetOnSet<T>(
  initialValue: T,
  onSet?: Cb1<T>, // unstable
) {
  const onSetCb = useAsCb(onSet)
  const [get, set0, ref] = useRefGetSet(initialValue)
  
  const set = (value: T) => {
    set0(value)
    onSetCb(value)
  }
  
  return [get, set, ref] as const // all stable
}
