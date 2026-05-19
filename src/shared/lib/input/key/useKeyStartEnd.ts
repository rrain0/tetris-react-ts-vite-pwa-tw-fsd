import { useSet } from '@@/utils/react/more/useSet.ts'
import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import type { EvCb } from '@@/utils/ts/ts.ts'
import React from 'react'



export function useKeyStartEnd<T = Element>(
  onKeyStartEnd: KeyStartEndEvHandler, // unstable
) {
  const onKeyStartEndCb = useAsCb(onKeyStartEnd)
  
  
  // ⬤⬤ State layer ⬤⬤
  
  const state = useSet<string>()
  const startKey = (key: string) => {
    state.add(key)
  }
  const endKey = (key: string) => {
    state.remove(key)
  }
  const hasKey = (key: string) => {
    return state.has(key)
  }
  const cancelAllKeys = () => {
    state.clear()
  }
  const getAllKeys = () => {
    return state.getAll()
  }
  
  
  // ⬤⬤ Event layer ⬤⬤
  
  // Save the pressed button
  const startEv = (ev: React.KeyboardEvent<T>) => {
    // ev.code => key: 'KeyA', 'ShiftLeft', 'ShiftRight', ...
    // ev.key => char: 'a', 'A', 'ф', 'Ф', 'Shift', ...
    const keyStartEv: KeyStartEndEv = {
      type: 'keyStart',
      ts: ev.timeStamp,
      key: ev.code,
    }
    onKeyStartEndCb(keyStartEv)
    startKey(ev.code)
  }
  // Check if there is keyDown for current button then remove saved button
  const endEv = (ev: React.KeyboardEvent<T>) => {
    if (hasKey(ev.code)) {
      const keyEndEv: KeyStartEndEv = {
        type: 'keyEnd',
        ts: ev.timeStamp,
        key: ev.code,
      }
      onKeyStartEndCb(keyEndEv)
      endKey(ev.code)
    }
  }
  const cancelAllEvs = (ev: React.FocusEvent<T>) => {
    for (const key of getAllKeys()) {
      const keyEndEv: KeyStartEndEv = {
        type: 'keyEnd',
        ts: ev.timeStamp,
        key: key,
      }
      onKeyStartEndCb(keyEndEv)
    }
    cancelAllKeys()
  }
  
  
  // ⬤⬤ Browser event layer ⬤⬤
  
  const onKeyDown: React.KeyboardEventHandler<T> = ev => {
    // Events from button hold does not count.
    if (!ev.repeat) startEv(ev)
  }
  const onKeyUp: React.KeyboardEventHandler<T> = ev => {
    endEv(ev)
  }
  // When the focus is lost from the element tree, we delete all saved buttons.
  const onBlur: React.FocusEventHandler<T> = ev => {
    cancelAllEvs(ev)
  }
  
  
  return { onKeyDown, onKeyUp, onBlur } // all stable
}



export type KeyStartEndEvHandler = EvCb<KeyStartEndEv>
export interface KeyStartEndEv {
  type: 'keyStart' | 'keyEnd'
  ts: number
  key: string
}
