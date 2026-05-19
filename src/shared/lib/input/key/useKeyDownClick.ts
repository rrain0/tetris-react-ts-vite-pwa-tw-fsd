import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import React from 'react'



export function useKeyDownClick<T = Element>(
  onKeyDownClick: React.KeyboardEventHandler<T>, // unstable
) {
  const onKeyDownClickCb = useAsCb(onKeyDownClick)
  
  
  // ⬤⬤ Browser event layer ⬤⬤
  
  // Эвенты от зажатия не считаются
  const onKeyDown: React.KeyboardEventHandler<T> = ev => {
    if (!ev.repeat) onKeyDownClickCb(ev)
  }
  
  
  return { onKeyDown } // all stable
}
