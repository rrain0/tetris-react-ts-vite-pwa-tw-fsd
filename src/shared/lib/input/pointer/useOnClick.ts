import { InputManagerContext } from '@@/lib/app/input-manager/context/InputManagerContext.ts'
import type { ReactOnClickEventModern } from '@@/utils/react/props/propTypes.ts'
import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import React, { use, useLayoutEffect } from 'react'
import * as uuid from 'uuid'



export function useOnClick<E>(onClick: (ev: React.MouseEvent<E>) => void) {
  const onClickStable = useAsCb(onClick)
  
  const inputId = uuid.v4()
  const { tryLock, unlock, allow } = use(InputManagerContext)
  
  useLayoutEffect(() => {
    const onPointer = (ev: PointerEvent) => {
      unlock(inputId, `pointer[${ev.pointerId}]`)
    }
    window.addEventListener('pointercancel', onPointer)
    window.addEventListener('click', onPointer)
    return () => {
      window.removeEventListener('pointercancel', onPointer)
      window.removeEventListener('click', onPointer)
    }
  })
  
  return {
    onPointerDown: (ev: React.PointerEvent) => {
      tryLock(inputId, `pointer[${ev.pointerId}]`)
    },
    onClick: (ev: React.MouseEvent<E>) => {
      const p = (ev as ReactOnClickEventModern<E>).nativeEvent.pointerId
      if (allow(inputId, `pointer[${p}]`)) {
        unlock(inputId, `pointer[${p}]`)
        onClickStable(ev)
      }
    },
  }
}
