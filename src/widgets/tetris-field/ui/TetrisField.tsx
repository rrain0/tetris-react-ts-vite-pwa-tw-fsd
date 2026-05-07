import { blockSizes } from '@/widgets/tetris-field/entities/block/ui/blockSizes.ts'
import type {
  Field, FieldBlockType,
} from '@@/lib/tetris/tetris-engine/entities/field/model/field.ts'
import type { PieceType } from '@@/lib/tetris/tetris-engine/entities/piece/model/piece.ts'
import { fracToPerc } from '@@/utils/css/sz.ts'
import type { Xy } from '@@/utils/math/rect.ts'
import type { Div } from '@@/utils/react/props/propTypes.ts'
import Block from '@/widgets/tetris-field/entities/block/ui/Block.tsx'
import { mapPieceTypeToBlockUiData } from '@/widgets/tetris-field/entities/block/lib/blockUi.ts'
import React from 'react'



export type TetrisFieldProps = Div & { field: Field }

export default function TetrisField({ field, ...rest }: TetrisFieldProps) {
  const { rows, cols } = field
  const { blockInFigure: blk } = blockSizes
  const p = blk.outsetSz / (blk.outsetSz + blk.sz * cols + blk.outsetSz)
  return (
    <div cn='layer-box' {...rest}>
      <div cn='layer-box'>
        <div cn='layer-box' st={{ padding: fracToPerc(p) }}>
          <div cn='grid stretch2'
            st={{
              aspectRatio: cols / rows,
              gridTemplateRows: `repeat(${rows},1fr)`,
              gridTemplateColumns: `repeat(${cols},1fr)`,
            }}
          >
            {[...field.blocksPresentIterator()].map(it => {
              const { x, y, value: { id, type, pieceType } } = it
              return <ListBlock key={id} x={x} y={y} type={type} pieceType={pieceType}/>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}



type ListBlockProps = Xy & { type?: FieldBlockType | undefined, pieceType: PieceType }
// Component used in list is not auto-memoized by React Compiler.
const ListBlock = React.memo(function ListBlock(fieldBlock: ListBlockProps) {
  const { x, y, type, pieceType } = fieldBlock
  const data = mapPieceTypeToBlockUiData(type, pieceType)
  const row = y + 1, col = x + 1
  
  const { blockSt } = blockSizes.blockInFigure
  
  return (
    <Block {...data} st={{ gridArea: `${row} / ${col}`, ...blockSt }}/>
  )
})
