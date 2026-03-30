import type { Field } from '@lib/tetris-engine/entities/field/model/field.ts'
import Block from '@widgets/tetris-field/entities/block/ui/Block.tsx'
import { mapPieceTypeToBlockUiType } from '@widgets/tetris-field/entities/block/lib/blockUi.ts'
import type { ComponentProps } from 'react'



export type TetrisFieldProps = ComponentProps<'div'> & {
  field: Field
}

export default function TetrisField({ field, ...rest }: TetrisFieldProps) {
  const { rows, cols } = field
  return (
    <div
      cn='grid w-full h-ct'
      st={{
        gridTemplateRows: `repeat(${rows},1fr)`,
        gridTemplateColumns: `repeat(${cols},1fr)`,
        aspectRatio: cols / rows,
      }}
      {...rest}
    >
      {[...field].map(({ x, y, block }) => {
        if (!block) return
        const type = mapPieceTypeToBlockUiType(block.type)
        if (!type) return
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
