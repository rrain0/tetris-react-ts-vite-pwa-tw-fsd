import PieceControlsButton from '@/screens/ingame/ui/piece-controls/PieceControlsButton.tsx'
import { usePointerDownClick } from '@@/lib/input/pointer/usePointerDownClick.ts'
import { usePointerStartEnd } from '@@/lib/input/pointer/usePointerStartEnd.ts'
import type { Game } from '@@/lib/tetris/game-engine/entities/game/model/game.ts'
import type { Div } from '@@/utils/react/props/propTypes.ts'
import React from 'react'



export type IngameControlsProps = Div & {
  game: Game,
}

export default function PieceControls(props: IngameControlsProps) {
  const { game } = props
  
  const onUp = usePointerStartEnd((ev) => {
    if (ev.type === 'pointerStart') game.startMoveUp()
    if (ev.type === 'pointerEnd') game.stopMoveUp()
  })
  const onDown = usePointerStartEnd((ev) => {
    if (ev.type === 'pointerStart') game.startSoftDrop()
    if (ev.type === 'pointerEnd') game.stopSoftDrop()
  })
  const onHardDrop = usePointerDownClick(() => game.startHardDrop())
  
  return (
    <div cn='pls-[stretch_start] grid rows-[4fr_5fr] no-pointer' {...props}>
      <div cn='pls-[end_start] flex col start-end g-[8] no-pointer'>
        <PieceControlsButton {...onUp}>
          up
        </PieceControlsButton>
        <PieceControlsButton {...onDown}>
          down
        </PieceControlsButton>
        <PieceControlsButton {...onHardDrop}>
          hard drop
        </PieceControlsButton>
      </div>
    </div>
  )
}
