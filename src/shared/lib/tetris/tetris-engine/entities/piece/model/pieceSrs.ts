import type { Blocks } from '@@/lib/tetris/tetris-engine/entities/piece/model/block.ts'
import {
  Piece,
  type PieceData, type PieceType,
} from '@@/lib/tetris/tetris-engine/entities/piece/model/piece.ts'
import { mathRotate, moveXy } from '@@/lib/tetris/tetris-engine/shared/utils/piece.ts'
import type { Xy, XydxdyOpt } from '@@/utils/math/rect.ts'
import type { Opt, OptKeys } from '@@/utils/ts/ts.ts'



// Srs - Super Rotation System https://harddrop.com/wiki/SRS

export type OffsetsSrs = {
  '0': Xy[]
  'R': Xy[]
  '2': Xy[]
  'L': Xy[]
}

export type PieceSrsConfig = {
  type: PieceType,
  x: number
  y: number
  blocks: Blocks<1 | 0>
  offsets: OffsetsSrs
}



export class PieceSrs extends Piece {
  offsets: OffsetsSrs
  
  constructor(data: PieceSrsDataCtor) {
    const { offsets, ...pieceData } = data
    super(pieceData)
    this.offsets = offsets
  }
  
  override copy(update?: PieceSrsDataOpt) {
    return new  PieceSrs({
      id: update?.id ?? this.id,
      type: update?.type ?? this.type,
      x: update?.x ?? this.x,
      y: update?.y ?? this.y,
      blocks: update?.blocks ?? this.blocks,
      rotI: update?.rotI ?? this.rotI,
      offsets: update?.offsets ?? this.offsets,
    })
  }
  
  override toMoved(move: XydxdyOpt): PieceSrs {
    const { x, y } = this
    const { x: x1, y: y1 } = moveXy(x, y, move)
    return this.copy({ x: x1, y: y1 })
  }
  override toRotatedRight() { return pieceSrsToRotated(this, 1) }
  override toRotatedLeft() { return pieceSrsToRotated(this, -1) }
}



export interface PieceSrsData extends PieceData {
  offsets: OffsetsSrs
}
export type PieceSrsDataOpt = Opt<PieceSrsData>
export type PieceSrsDataCtor = OptKeys<PieceSrsData, 'rotI'>



// Uses mathematical rotation then applies wall kicks
export function *pieceSrsToRotated(piece: PieceSrs, direction: 1 | -1): IterableIterator<PieceSrs> {
  const p = piece
  const { blocks, rotI } = mathRotate(p.blocks, p.rotI, direction)
  
  const fromRot = (['0', 'R', '2', 'L'] as const)[p.rotI]
  const toRot = (['0', 'R', '2', 'L'] as const)[rotI]
  for (let i = 0; i < p.offsets[fromRot].length; i++)  {
    const kickTranslation = {
      x: p.offsets[fromRot][i].x - p.offsets[toRot][i].x,
      y: p.offsets[fromRot][i].y - p.offsets[toRot][i].y,
    }
    const x = p.x + kickTranslation.x
    const y = p.y + kickTranslation.y
    yield p.copy({ x, y, blocks, rotI })
  }
}
