import { useLockClick } from '@@/lib/input/shared/useLockClick.ts'
import type { ReactOnClickEventModern } from '@@/utils/react/props/propTypes.ts'
import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import React from 'react'



export function usePointerClick<E = Element>(onClick: (ev: React.MouseEvent<E>) => void) {
  const onClickCb = useAsCb(onClick)
  
  const { tryLock, unlock, allowed } = useLockClick()
  
  return {
    onPointerDown: (ev: React.PointerEvent) => {
      const { pointerId } = ev
      tryLock(pointerId)
    },
    onClick: (ev: React.MouseEvent<E>) => {
      const { pointerId } = (ev as ReactOnClickEventModern<E>).nativeEvent
      if (allowed(pointerId)) {
        unlock(pointerId)
        onClickCb(ev)
      }
    },
  }
}
