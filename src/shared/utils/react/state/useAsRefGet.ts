import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'



export function useAsRefGet<T>(
  currentValue: T, // unstable
) {
  const [get, set, ref] = useRefGetSet(currentValue)
  set(currentValue)
  
  return [get, ref] as const // all stable
}
