import type { FieldBlockType } from '@@/lib/tetris/tetris-engine/entities/field/model/field.ts'
import type { PieceType } from '@@/lib/tetris/tetris-engine/entities/piece/model/piece.ts'
import { mapBlockTypeToSrc } from '@/widgets/tetris-field/entities/block/lib/block.ts'
import type {
  BlockUiData,
  BlockUiType,
} from '@/widgets/tetris-field/entities/block/model/blockUi.ts'
import type { BlockType } from '@/widgets/tetris-field/entities/block/model/block.ts'



export function mapBlockUiTypeToSrc(type: BlockUiType): string | undefined {
  if (!type) return undefined
  return mapBlockTypeToSrc(type)
}

export function mapPieceTypeToBlockUiData(
  type: FieldBlockType | undefined,
  pieceType: PieceType,
): BlockUiData {
  const mapper: Record<BlockType, Partial<BlockUiData>> = {
    I: { type: 'red' },
    J: { type: 'blue' },
    L: { type: 'orange' },
    O: { type: 'yellow' },
    S: { type: 'violet' },
    T: { type: 'lightBlue' },
    Z: { type: 'green' },
    
    Next: { pixeled: true },
    NextGhost: { pixeled: true, translucent: true },
  }
  
  // @ts-expect-error
  return [type, pieceType].reduce((acc, it) => Object.assign(acc, mapper[it]), { })
}
