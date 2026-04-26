import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import React from 'react'



export function useKeyHold<T = HTMLDivElement>(
  {
    interval = 100, // not updates during hold event
    //delay = 0, // not updates during hold event
  },
  onKeyHold: React.KeyboardEventHandler<T>, // unstable
) {
  const onKeyHoldCb = useAsCb(onKeyHold)
  
  
  // ⬤⬤ State layer ⬤⬤
  
  const [getState] = useRefGetSet(new Map<KeyId, IntervalId>())
  const checkKey = (keyId: KeyId) => {
    return getState().has(keyId)
  }
  const startKey = (keyId: KeyId, intervalId: any) => {
    getState().set(keyId, intervalId)
  }
  const finishKey = (keyId: KeyId) => {
    clearInterval(getState().get(keyId))
    getState().delete(keyId)
  }
  const cancelAllKeys = () => {
    for (const intervalId of getState().values()) clearInterval(intervalId)
    getState().clear()
  }
  
  
  // ⬤⬤ Event layer ⬤⬤
  
  // Save the pressed button
  const startEv = (ev: React.KeyboardEvent<T>) => {
    onKeyHoldCb(ev)
    const intervalId = setInterval(() => {
      onKeyHoldCb(ev)
    }, interval)
    const keyId = getKeyId(ev)
    startKey(keyId, intervalId)
  }
  // Check if there is keyDown for current button then remove saved button
  const finishEv = (ev: React.KeyboardEvent<T>) => {
    const keyId = getKeyId(ev)
    if (checkKey(keyId)) finishKey(keyId)
  }
  const cancelAllEvs = () => {
    cancelAllKeys()
  }
  
  
  // ⬤⬤ Browser event layer ⬤⬤
  
  const onKeyDown: React.KeyboardEventHandler<T> = ev => {
    // Events from button hold does not count.
    if (!ev.repeat) startEv(ev)
  }
  const onKeyUp: React.KeyboardEventHandler<T> = ev => {
    finishEv(ev)
  }
  // When the focus is lost from the element tree, we delete all saved buttons.
  const onBlur = () => {
    cancelAllEvs()
  }
  
  
  return { onKeyDown, onKeyUp, onBlur } // all stable
}



type CodeKey = { code: string, key: string }
type KeyId = string
type IntervalId = any



function getKeyId(codeKey: CodeKey): KeyId {
  const { code, key } = codeKey
  return JSON.stringify({ code, key })
}
