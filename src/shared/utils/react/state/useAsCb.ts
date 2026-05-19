import { useAsRefGet } from '@@/utils/react/state/useAsRefGet.ts'
import type { anyfun } from '@@/utils/ts/ts.ts'



export function useAsCb<Cb extends anyfun>(
  cb: Cb | undefined, // unstable
): Cb {
  const [getCb] = useAsRefGet(cb)
  const stableCb = ((...args) => getCb()?.(...args)) as Cb
  return stableCb // stable
}
