import { useAsCb } from '@utils/react/state/useAsCb.ts'
import { useRefGetSet } from '@utils/react/state/useRefGetSet.ts'
import React from 'react'



export function useKeyHold<T = HTMLDivElement>(
  {
    interval = 100, // not updates during hold event
    //delay = 0, // not updates during hold event
  },
  onKeyHold: React.KeyboardEventHandler<T>, // unstable
) {
  const onKeyHoldCb = useAsCb(onKeyHold)
  
  
  // State layer
  
  const [getState] = useRefGetSet(new Map<JsonCodeKey, IntervalId>())
  const checkKey = (ev: KbEv) => {
    return getState().has(evToJsonCodeKey(ev))
  }
  const startKey = (ev: KbEv, intervalId) => {
    getState().set(evToJsonCodeKey(ev), intervalId)
  }
  const finishKey = (ev: KbEv) => {
    clearInterval(getState().get(evToJsonCodeKey(ev)))
    getState().delete(evToJsonCodeKey(ev))
  }
  const cancelAllKeys = () => {
    for (const intervalId of getState().values()) clearInterval(intervalId)
    getState().clear()
  }
  
  
  // Event layer
  
  const startEv = (ev: React.KeyboardEvent<T>) => {
    onKeyHoldCb(ev)
    const intervalId = setInterval(() => {
      onKeyHoldCb(ev)
    }, interval)
    startKey(ev, intervalId)
  }
  const finishEv = (ev: React.KeyboardEvent<T>) => {
    if (checkKey(ev)) finishKey(ev)
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
type IntervalId = any
type KbEv = KeyboardEvent | React.KeyboardEvent<any>



function evToJsonCodeKey(ev: KbEv) {
  const { code, key } = ev
  const jsonCodeKey = JSON.stringify({ code, key })
  return jsonCodeKey
}
