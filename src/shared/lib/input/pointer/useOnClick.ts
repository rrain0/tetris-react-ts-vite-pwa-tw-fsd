import { useLockClick } from '@@/lib/input/shared/useLockClick.ts'
import type { ReactOnClickEventModern } from '@@/utils/react/props/propTypes.ts'
import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import React from 'react'



export function useOnClick<E = Element>(onClick: (ev: React.MouseEvent<E>) => void) {
  const onClickStable = useAsCb(onClick)
  
  const { tryLock, unlock, allowed } = useLockClick()
  
  return {
    onPointerDown: (ev: React.PointerEvent) => {
      tryLock(`pointer[${ev.pointerId}]`)
    },
    onClick: (ev: React.MouseEvent<E>) => {
      const p = (ev as ReactOnClickEventModern<E>).nativeEvent.pointerId
      if (allowed(`pointer[${p}]`)) {
        unlock(`pointer[${p}]`)
        onClickStable(ev)
      }
    },
  }
}
