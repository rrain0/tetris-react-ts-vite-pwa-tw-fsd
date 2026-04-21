import type { Xy } from '@@/utils/math/rect.ts'
import React from 'react'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'



export function usePointer<A extends any[]>(
  onDrag: (move: MoveData, ...args: A) => void,
) {
  
  // TODO сохранять для каждого инстанса листенеров свои данные
  const [getMove] = useRefGetSet<Record<string, MoveData | undefined>>({ })
  
  return (...args: A) => {
    
    const onPointerDown = (ev: React.PointerEvent) => {
      const { pointerId, clientX: vpx, clientY: vpy } = ev
      const curr: MoveData = {
        ev,
        evType: 'down',
        pointerId,
        
        start: true,
        wasStart: true,
        
        first: true,
        last: false,
        
        vp0: { x: vpx, y: vpy },
        vp: { x: vpx, y: vpy },
        move: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      getMove()[pointerId] = curr
      onDrag(curr, ...args)
    }
    
    const onPointerMove = (ev: React.PointerEvent) => {
      const { pointerId, clientX: vpx, clientY: vpy } = ev
      const prev = getMove()[pointerId]
      const curr: MoveData = {
        ev,
        evType: 'move',
        pointerId,
        
        start: false,
        wasStart: prev?.wasStart ?? false,
        
        first: false,
        last: false,
        
        vp0: prev?.vp0 ?? { x: vpx, y: vpy },
        vp: { x: vpx, y: vpy },
        move: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      if (!prev) curr.first = true
      curr.move = { x: curr.vp.x - curr.vp0.x, y: curr.vp.y - curr.vp0.y }
      if (prev) curr.delta = { x: curr.vp.x - prev.vp0.x, y: curr.vp.y - prev.vp0.y }
      getMove()[pointerId] = curr
      onDrag(curr, ...args)
    }
    
    const onPointerUp = (ev: React.PointerEvent) => {
      const { pointerId, clientX: vpx, clientY: vpy } = ev
      const prev = getMove()[pointerId]
      const curr: MoveData = {
        ev,
        evType: 'up',
        pointerId,
        
        start: false,
        wasStart: prev?.wasStart ?? false,
        
        first: false,
        last: true,
        
        vp0: prev?.vp0 ?? { x: vpx, y: vpy },
        vp: { x: vpx, y: vpy },
        move: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      if (!prev) curr.first = true
      curr.move = { x: curr.vp.x - curr.vp0.x, y: curr.vp.y - curr.vp0.y }
      if (prev) curr.delta = { x: curr.vp.x - prev.vp0.x, y: curr.vp.y - prev.vp0.y }
      delete getMove()[pointerId]
      onDrag(curr, ...args)
    }
    
    const onPointerCancel = (ev: React.PointerEvent) => {
      const { pointerId, clientX: vpx, clientY: vpy } = ev
      const prev = getMove()[pointerId]
      const curr: MoveData = {
        ev,
        evType: 'cancel',
        pointerId,
        
        start: false,
        wasStart: prev?.wasStart ?? false,
        
        first: false,
        last: true,
        
        vp0: prev?.vp0 ?? { x: vpx, y: vpy },
        vp: { x: vpx, y: vpy },
        move: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      if (!prev) curr.first = true
      curr.move = { x: curr.vp.x - curr.vp0.x, y: curr.vp.y - curr.vp0.y }
      if (prev) curr.delta = { x: curr.vp.x - prev.vp0.x, y: curr.vp.y - prev.vp0.y }
      delete getMove()[pointerId]
      onDrag(curr, ...args)
    }
    
    const onLostPointerCapture = (ev: React.PointerEvent) => {
      const { pointerId, clientX: vpx, clientY: vpy } = ev
      const prev = getMove()[pointerId]
      const curr: MoveData = {
        ev,
        evType: 'lostCapture',
        pointerId,
        
        start: false,
        wasStart: prev?.wasStart ?? false,
        
        first: false,
        last: true,
        
        vp0: prev?.vp0 ?? { x: vpx, y: vpy },
        vp: { x: vpx, y: vpy },
        move: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      if (!prev) curr.first = true
      curr.move = { x: curr.vp.x - curr.vp0.x, y: curr.vp.y - curr.vp0.y }
      if (prev) curr.delta = { x: curr.vp.x - prev.vp0.x, y: curr.vp.y - prev.vp0.y }
      delete getMove()[pointerId]
      onDrag(curr, ...args)
    }
    
    return {
      onPointerDown, // stable
      onPointerMove, // stable
      onPointerUp, // stable
      onPointerCancel, // stable
      onLostPointerCapture, // stable
    }
  }
}



export type MoveData = {
  ev: React.PointerEvent
  evType: 'down' | 'move' | 'up' | 'cancel' | 'lostCapture'
  pointerId: number
  
  start: boolean
  wasStart: boolean
  
  first: boolean
  last: boolean
  
  // Start of drag coords relative viewport
  vp0: Xy
  // Current coords relative viewport
  vp: Xy
  // Distance from start point to current point
  move: Xy
  // Distance from previous point to current point
  delta: Xy
}
