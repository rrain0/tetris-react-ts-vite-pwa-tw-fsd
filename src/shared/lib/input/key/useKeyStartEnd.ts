import { setOf } from '@@/utils/js/factory.ts'
import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import type { EvCb } from '@@/utils/ts/ts.ts'
import React from 'react'



export function useKeyStartEnd<T = HTMLDivElement>(
  onKeyHold: KeyStartEndEvHandler, // unstable
) {
  const onKeyStartEndCb = useAsCb(onKeyHold)
  
  
  // ⬤⬤ State layer ⬤⬤
  
  const [getState] = useRefGetSet<Set<string>>(setOf())
  const startKey = (keyId: string) => {
    getState().add(keyId)
  }
  const endKey = (keyId: KeyId) => {
    getState().delete(keyId)
  }
  const checkKey = (keyId: KeyId) => {
    return getState().has(keyId)
  }
  const cancelAllKeys = () => {
    getState().clear()
  }
  const getAllKeys = () => {
    return getState()
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
    if (checkKey(ev.code)) {
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



export interface KeyStartEndEv {
  type: 'keyStart' | 'keyEnd'
  ts: number
  key: string
}

export type KeyStartEndEvHandler = EvCb<KeyStartEndEv>



type CodeKey = { code: string, key: string }
type KeyId = string



function getKeyId(codeKey: CodeKey): KeyId {
  const { code, key } = codeKey
  return JSON.stringify({ code, key })
}
