import { setOf } from '@@/utils/react/state/state.ts'
import { useRefGetSetInit } from '@@/utils/react/state/useRefGetSetInit.ts'
import type { EvCb } from '@@/utils/ts/ts.ts'



export function useListeners<Ev>() {
  type L = EvCb<Ev>
  const [getListeners] = useRefGetSetInit<Set<L>>(setOf)
  
  function add(l: L) { getListeners().add(l) }
  function remove(l: L) { getListeners().delete(l) }
  
  function notify(ev: Ev) { for (const l of getListeners()) l(ev) }
  
  return { add, remove, notify }
}
