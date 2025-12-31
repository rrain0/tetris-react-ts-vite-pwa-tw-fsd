import Block from '@entities/block/ui/Block.tsx'
import { Field } from '@lib/tetris-engine/entities/field/model/field.ts'
import {
  newISrs, newJSrs, newLSrs,
  newOSrs, newSSrs,
  newTSrs,
  newZSrs,
} from '@lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { mapPieceTypeToBlockUiType } from 'entities/block/lib/blockUi.ts'
import * as React from 'react'


// TODO loading screen to save images to RAM (dataUrl)


const field = new Field()
field.addPiece(newOSrs(undefined, [4, 5]))
field.addPiece(newTSrs(undefined, [0, 14]).toRotated(2))
field.addPiece(newISrs(undefined, [-2, 15]).toRotated(1))
field.addPiece(newZSrs(undefined, [1, 18]))
field.addPiece(newSSrs(undefined, [3, 15]).toRotated(-1))
field.addPiece(newJSrs(undefined, [4, 18]))
field.addPiece(newLSrs(undefined, [6, 14]).toRotated(1))
field.addPiece(newOSrs(undefined, [6, 18]))
field.addPiece(newTSrs(undefined, [8, 16]).toRotated(-1))



function TetrisField() {
  
  return (
    <div className={`
        grid w-[300] h-ct
        rows-[repeat(20,1fr)] cols-[repeat(10,1fr)]
        ${fieldStyle}
      `}
    >
      {[...field].map(({ x, y, block }) => {
        if (!block) return undefined
        const type = mapPieceTypeToBlockUiType(block.type)
        if (!type) return undefined
        const ri = y + 1
        const ci = x + 1
        return (
          <Block type={type}
            key={`${ri} ${ci}`}
            style={{ gridArea: `${ri} / ${ci}` }}
          />
        )
      })}
    </div>
  )
}
export default TetrisField



const fieldStyle = 'border-[3px] border-solid border-[#808080] rounded-[4px]'
