import { useLockPointerDrag } from '@@/lib/input/shared/useLockPointerDrag.ts'
import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import React from 'react'



export function usePointerDownClick<T = Element>(
  onPointerDownClick: React.PointerEventHandler<T>, // unstable
) {
  const onPointerDownClickCb = useAsCb(onPointerDownClick)
  
  const { tryLock, unlock, allowed } = useLockPointerDrag()
  
  // ⬤⬤ Browser event layer ⬤⬤
  
  const onPointerDown: React.PointerEventHandler<T> = ev => {
    const { pointerId } = ev
    if (tryLock(pointerId)) {
      onPointerDownClickCb(ev)
    }
  }
  
  
  return { onPointerDown } // all stable
}
