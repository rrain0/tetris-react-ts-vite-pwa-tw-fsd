import { useLockInputId } from '@@/lib/input/shared/useLockInputId.ts'
import { useLayoutEffect } from 'react'



export function useLockPointerDrag() {
  const { lock, unlock, tryLock, allowed } = useLockInputId()
  
  useLayoutEffect(() => {
    const onPointer = (ev: PointerEvent) => {
      unlock(`pointer[${ev.pointerId}]`)
    }
    window.addEventListener('pointercancel', onPointer)
    window.addEventListener('pointerup', onPointer)
    return () => {
      window.removeEventListener('pointercancel', onPointer)
      window.removeEventListener('pointerup', onPointer)
    }
  })
  
  return { lock, unlock, tryLock, allowed }
}
