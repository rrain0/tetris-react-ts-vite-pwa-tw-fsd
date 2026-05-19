import type { PointerId } from '@@/lib/app/input-manager/model/inputManager.model.ts'
import { useLockInputId } from '@@/lib/input/shared/useLockInputId.ts'
import { useLayoutEffect } from 'react'



export function useLockClick() {
  const inputControls = useLockInputId()
  
  const lock = (pointerId: PointerId) => inputControls.lock({ type: 'pointer', pointerId })
  const unlock = (pointerId: PointerId) => inputControls.unlock({ type: 'pointer', pointerId })
  const tryLock = (pointerId: PointerId) => inputControls.tryLock({ type: 'pointer', pointerId })
  const allowed = (pointerId: PointerId) => inputControls.allowed({ type: 'pointer', pointerId })
  
  useLayoutEffect(() => {
    const onPointer = (ev: PointerEvent) => {
      const { pointerId } = ev
      unlock(pointerId)
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
