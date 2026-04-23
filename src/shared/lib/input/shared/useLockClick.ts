import { useLockInputId } from '@@/lib/input/shared/useLockInputId.ts'
import { useLayoutEffect } from 'react'



export function useLockClick() {
  const { lock, unlock, tryLock, allowed } = useLockInputId()
  
  useLayoutEffect(() => {
    const onPointer = (ev: PointerEvent) => {
      unlock(`pointer[${ev.pointerId}]`)
    }
    window.addEventListener('pointercancel', onPointer)
    window.addEventListener('click', onPointer)
    return () => {
      window.removeEventListener('pointercancel', onPointer)
      window.removeEventListener('click', onPointer)
    }
  })
  
  return { lock, unlock, tryLock, allowed }
}
