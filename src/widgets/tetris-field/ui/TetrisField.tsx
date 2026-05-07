import { blockSizes } from '@/widgets/tetris-field/entities/block/ui/blockSizes.ts'
import type {
  Field, FieldBlockType,
} from '@@/lib/tetris/tetris-engine/entities/field/model/field.ts'
import type { PieceType } from '@@/lib/tetris/tetris-engine/entities/piece/model/piece.ts'
import type { Xy } from '@@/utils/math/rect.ts'
import type { Div } from '@@/utils/react/props/propTypes.ts'
import Block from '@/widgets/tetris-field/entities/block/ui/Block.tsx'
import { mapPieceTypeToBlockUiData } from '@/widgets/tetris-field/entities/block/lib/blockUi.ts'
import React from 'react'



export type TetrisFieldProps = Div & { field: Field }

export default function TetrisField({ field, ...rest }: TetrisFieldProps) {
  const { rows, cols } = field
  return (
    <div
      cn='grid pli-[stretch]'
      st={{
        gridTemplateRows: `repeat(${rows},1fr)`,
        gridTemplateColumns: `repeat(${cols},1fr)`,
        aspectRatio: cols / rows,
      }}
      {...rest}
    >
      {[...field.blocksPresentIterator()].map(it => {
        const { x, y, value: { id, type, pieceType } } = it
        return <ListBlock key={id} x={x} y={y} type={type} pieceType={pieceType}/>
      })}
    </div>
  )
}



type ListBlockProps = Xy & { type?: FieldBlockType | undefined, pieceType: PieceType }
// Component used in list is not auto-memoized by React Compiler.
const ListBlock = React.memo(function ListBlock(fieldBlock: ListBlockProps) {
  const { x, y, type, pieceType } = fieldBlock
  const data = mapPieceTypeToBlockUiData(type, pieceType)
  const row = y + 1, col = x + 1
  
  const { boxSt } = blockSizes().blockInFigure
  
  return (
    <div cn='container-size' st={{ gridArea: `${row} / ${col}` }}>
      <Block {...data} st={boxSt}/>
    </div>
  )
})
