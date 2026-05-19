import { useAsRefGet } from '@@/utils/react/state/useAsRefGet.ts'



export function useAsStateAndRef<S>(state: S) {
  const [get, ref] = useAsRefGet(state)
  
  return [
    state,
    get,  // stable
  ] as const
}
