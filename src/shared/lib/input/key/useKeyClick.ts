import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import React from 'react'



export function useKeyClick<T = Element>(
  onKeyClick: React.KeyboardEventHandler<T>, // unstable
) {
  const onKeyClickCb = useAsCb(onKeyClick)
  
  
  // ⬤⬤ State layer ⬤⬤
  
  const [getState] = useRefGetSet(new Set<KeyId>())
  const checkKey = (keyId: KeyId) => {
    return getState().has(keyId)
  }
  const startKey = (keyId: KeyId) => {
    getState().add(keyId)
  }
  const finishKey = (keyId: KeyId) => {
    getState().delete(keyId)
  }
  const cancelAllKeys = () => {
    getState().clear()
  }
  
  
  // ⬤⬤ Event layer ⬤⬤
  
  const startEv = (ev: React.KeyboardEvent<T>) => {
    const keyId = getKeyId(ev)
    startKey(keyId)
  }
  const finishEv = (ev: React.KeyboardEvent<T>) => {
    const keyId = getKeyId(ev)
    if (checkKey(keyId)) {
      finishKey(keyId)
      onKeyClickCb(ev)
    }
  }
  const cancelAllEvs = () => {
    cancelAllKeys()
  }
  
  
  // ⬤⬤ Browser event layer ⬤⬤
  
  // Save the pressed button
  // Эвенты от зажатия не считаются
  const onKeyDown: React.KeyboardEventHandler<T> = ev => {
    if (!ev.repeat) startEv(ev)
  }
  // Check if there is keyDown for current button
  // then emit keyClick event then remove saved button
  const onKeyUp: React.KeyboardEventHandler<T> = ev => {
    finishEv(ev)
  }
  // При потере фокуса из дерева элемента, удаляем все сохранённые кнопки
  const onBlur = () => {
    cancelAllEvs()
  }
  
  
  return { onKeyDown, onKeyUp, onBlur } // all stable
}



type CodeKey = { code: string, key: string }
type KeyId = string



function getKeyId(codeKey: CodeKey): KeyId {
  const { code, key } = codeKey
  return JSON.stringify({ code, key })
}
