import type { PointerId } from '@@/utils/pointer/types.ts'
import { useRecord } from '@@/utils/react/more/useRecord.ts'
import type { Xy } from '@@/utils/math/rect.ts'
import React from 'react'



export function usePointer<A extends any[]>(onDrag: OnDrag<A>) {
  const [getMove, setMove] = useRecord<PointerId, MoveData>()
  
  
  
  // Performs shallow update of current move object with props that exists in update.
  // If your move does not start from 'down' then you can update { wasStarted: true }.
  // Changes are saved across events (if event does not write particular prop with its data).
  // You have different move object references on each event.
  const updateMove = (pointerId: PointerId, update: MoveUpdate): MoveData | undefined => {
    const move = getMove(pointerId)
    if (move) Object.assign(move, update)
    return move
  }
  
  
  
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
        moved: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      setMove(pointerId, curr)
      onDrag(curr, updateMove, ...args)
    }
    
    const onPointerMove = (ev: React.PointerEvent) => {
      const { pointerId, clientX: vpx, clientY: vpy } = ev
      const prev = getMove(pointerId)
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
        moved: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      if (!prev) curr.first = true
      curr.moved = { x: curr.vp.x - curr.vp0.x, y: curr.vp.y - curr.vp0.y }
      if (prev) curr.delta = { x: curr.vp.x - prev.vp0.x, y: curr.vp.y - prev.vp0.y }
      setMove(pointerId, curr)
      onDrag(curr, updateMove, ...args)
    }
    
    const onPointerUp = (ev: React.PointerEvent) => {
      const { pointerId, clientX: vpx, clientY: vpy } = ev
      const prev = getMove(pointerId)
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
        moved: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      if (!prev) curr.first = true
      curr.moved = { x: curr.vp.x - curr.vp0.x, y: curr.vp.y - curr.vp0.y }
      if (prev) curr.delta = { x: curr.vp.x - prev.vp0.x, y: curr.vp.y - prev.vp0.y }
      setMove(pointerId, undefined)
      onDrag(curr, updateMove, ...args)
    }
    
    const onPointerCancel = (ev: React.PointerEvent) => {
      const { pointerId, clientX: vpx, clientY: vpy } = ev
      const prev = getMove(pointerId)
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
        moved: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      if (!prev) curr.first = true
      curr.moved = { x: curr.vp.x - curr.vp0.x, y: curr.vp.y - curr.vp0.y }
      if (prev) curr.delta = { x: curr.vp.x - prev.vp0.x, y: curr.vp.y - prev.vp0.y }
      setMove(pointerId, undefined)
      onDrag(curr, updateMove, ...args)
    }
    
    const onLostPointerCapture = (ev: React.PointerEvent) => {
      const { pointerId, clientX: vpx, clientY: vpy } = ev
      const prev = getMove(pointerId)
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
        moved: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      }
      if (!prev) curr.first = true
      curr.moved = { x: curr.vp.x - curr.vp0.x, y: curr.vp.y - curr.vp0.y }
      if (prev) curr.delta = { x: curr.vp.x - prev.vp0.x, y: curr.vp.y - prev.vp0.y }
      setMove(pointerId, undefined)
      onDrag(curr, updateMove, ...args)
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
  
  // Coords relative viewport (start point) of first pointer event.
  vp0: Xy
  // Coords relative viewport of current event.
  vp: Xy
  // Distance from start point to current point
  moved: Xy
  // Distance from previous point to current point
  delta: Xy
}

export type MoveUpdate = Partial<MoveData>

export type UpdateMove = (pointerId: PointerId, update: MoveUpdate) => MoveData | undefined
export type OnDrag<A extends any[]> = (move: MoveData, update: UpdateMove, ...args: A) => void
