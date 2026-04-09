import type { HSElem } from '@utils/elem/elem.ts'
import { useAsCb } from '@utils/react/state/useAsCb.ts'
import { useRefGetSet } from '@utils/react/state/useRefGetSet.ts'
import type { Cb1 } from '@utils/ts/ts.ts'



// Does not trigger rerender (if you do not set state inside callback)
export const useResizeRef = <T extends HSElem = HSElem>(
  onResize: Cb1<T | null> // supports not stable
) => {
  const onResizeStable = useAsCb(onResize)
  
  const [getResizeObserver, setResizeObserver] = useRefGetSet<undefined | ResizeObserver>(undefined)
  
  const elemRefFun = (elem: T | null) => {
    getResizeObserver()?.disconnect()
    setResizeObserver(undefined)
    
    onResizeStable(elem)
    if (elem) {
      const update = () => onResizeStable(elem)
      const resizeObserver = new ResizeObserver(update)
      resizeObserver.observe(elem)
      setResizeObserver(resizeObserver)
    }
  }
  
  return elemRefFun
}
