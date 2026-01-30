import { useAsCb } from '@utils/react/state/useAsCb.ts'
import { useRefGetSet } from '@utils/react/state/useRefGetSet.ts'
import React from 'react'



export function useKeyClick<T = HTMLDivElement>(
  onKeyClick: React.KeyboardEventHandler<T>, // unstable
) {
  const onKeyClickCb = useAsCb(onKeyClick)
  
  
  // State layer
  
  const [getState] = useRefGetSet(new Set<JsonCodeKey>())
  const checkKey = (ev: KbEv) => {
    return getState().has(evToJsonCodeKey(ev))
  }
  const startKey = (ev: KbEv) => {
    getState().add(evToJsonCodeKey(ev))
  }
  const finishKey = (ev: KbEv) => {
    getState().delete(evToJsonCodeKey(ev))
  }
  const cancelAllKeys = () => {
    getState().clear()
  }
  
  
  // Event layer
  
  const startEv = (ev: React.KeyboardEvent<T>) => {
    startKey(ev)
  }
  const finishEv = (ev: React.KeyboardEvent<T>) => {
    if (checkKey(ev)) {
      finishKey(ev)
      onKeyClickCb(ev)
    }
  }
  const cancelAllEvs = () => {
    cancelAllKeys()
  }
  
  
  // Browser event layer
  
  // Сохраняем нажатую кнопку
  // Эвенты от зажатия не считаются
  const onKeyDown: React.KeyboardEventHandler<T> = ev => {
    if (!ev.repeat) startEv(ev)
  }
  // Проверяем есть ли сохранённый keyDown для текущй кнопки,
  // вызываем keyClick эвент, удаляем сохранённую кнопку
  const onKeyUp: React.KeyboardEventHandler<T> = ev => {
    finishEv(ev)
  }
  // Делает элемент фокусируемым (но не через Tab)
  const tabIndex = -1 as const
  // При потере фокуса из дерева элемента, удаляем все сохранённые кнопки
  const onBlur = () => {
    cancelAllEvs()
  }
  
  
  return { onKeyDown, onKeyUp, tabIndex, onBlur } // all stable
}



type JsonCodeKey = string
type KbEv = KeyboardEvent | React.KeyboardEvent<any>



function evToJsonCodeKey(ev: KbEv) {
  const { code, key } = ev
  const jsonCodeKey = JSON.stringify({ code, key })
  return jsonCodeKey
}
