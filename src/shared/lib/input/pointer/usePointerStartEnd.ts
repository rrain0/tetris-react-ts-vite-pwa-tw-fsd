import { useLockPointerDrag } from '@@/lib/input/shared/useLockPointerDrag.ts'
import type { PointerId } from '@@/utils/pointer/types.ts'
import { useSet } from '@@/utils/react/more/useSet.ts'
import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import type { EvCb } from '@@/utils/ts/ts.ts'
import React from 'react'



export function usePointerStartEnd<T = Element>(
  onPointerStartEnd: PointerStartEndEvHandler, // unstable
) {
  const onPointerStartEndCb = useAsCb(onPointerStartEnd)
  
  
  // ⬤⬤ State layer ⬤⬤
  
  const state = useSet<PointerId>()
  const startPointer = (key: PointerId) => {
    state.add(key)
  }
  const endPointer = (key: PointerId) => {
    state.remove(key)
  }
  const hasPointer = (key: PointerId) => {
    return state.has(key)
  }
  const cancelAllPointers = () => {
    state.clear()
  }
  const getAllPointers = () => {
    return state.getAll()
  }
  
  
  
  // ⬤⬤ Event layer ⬤⬤
  
  const { tryLock, unlock, allowed } = useLockPointerDrag()
  
  // Save the pressed pointer
  const startEv = (ev: React.PointerEvent<T>) => {
    if (tryLock(ev.pointerId)) {
      const pointerStartEv: PointerStartEndEv = {
        type: 'pointerStart',
        ts: ev.timeStamp,
        pointerId: ev.pointerId,
      }
      onPointerStartEndCb(pointerStartEv)
      startPointer(ev.pointerId)
    }
  }
  // Check if there is keyDown for current button then remove saved button
  const endEv = (ev: React.PointerEvent<T>) => {
    if (hasPointer(ev.pointerId)) {
      unlock(ev.pointerId)
      const pointerEndEv: PointerStartEndEv = {
        type: 'pointerEnd',
        ts: ev.timeStamp,
        pointerId: ev.pointerId,
      }
      onPointerStartEndCb(pointerEndEv)
      endPointer(ev.pointerId)
    }
  }
  const cancelAllEvs = (ev: React.FocusEvent<T>) => {
    for (const pointerId of getAllPointers()) {
      unlock(pointerId)
      const pointerEndEv: PointerStartEndEv = {
        type: 'pointerEnd',
        ts: ev.timeStamp,
        pointerId: pointerId,
      }
      onPointerStartEndCb(pointerEndEv)
    }
    cancelAllPointers()
  }
  
  
  // ⬤⬤ Browser event layer ⬤⬤
  
  const onPointerDown: React.PointerEventHandler<T> = ev => {
    // Events from button hold does not count.
    startEv(ev)
  }
  const onPointerUp: React.PointerEventHandler<T> = ev => {
    endEv(ev)
  }
  const onPointerCancel: React.PointerEventHandler<T> = ev => {
    endEv(ev)
  }
  // When the focus is lost from the element tree, we delete all saved buttons.
  const onBlur: React.FocusEventHandler<T> = ev => {
    cancelAllEvs(ev)
  }
  
  
  return { onPointerDown, onPointerUp, onPointerCancel, onBlur } // all stable
}



export type PointerStartEndEvHandler = EvCb<PointerStartEndEv>
export interface PointerStartEndEv {
  type: 'pointerStart' | 'pointerEnd'
  ts: number
  pointerId: PointerId
}
