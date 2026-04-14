import {
  type Block,
  type Blocks,
  blocksCols, blocksGetBounds,
  blocksIterator, blocksRows,
} from '@@/lib/tetris-engine/entities/piece/model/block.ts'
import { mathRotate, moveXy } from '@@/lib/tetris-engine/shared/utils/piece.ts'
import type { Id } from '@@/utils/app/id.ts'
import type { XydxdyOpt } from '@@/utils/math/rect.ts'
import type { Opt, PartOpt } from '@@/utils/ts/ts.ts'



export type PieceBlockValue = 0 | 1
export type PieceBlocks = Blocks<PieceBlockValue>
export type PieceBlock = Block<PieceBlockValue>

export type PieceType = string


export class Piece {
  id: Id
  type: PieceType
  x: number
  y: number
  blocks: PieceBlocks
  // Поворот с системой координат как у часов
  // 0 - 0°, 1 - 90°, 2 - 180°, 3 - 270°/-90°
  rotI = 0
  
  constructor(data: PieceDataCtor) {
    this.id = data.id
    this.type = data.type
    this.x = data.x
    this.y = data.y
    this.blocks = data.blocks
    this.rotI = data.rotI ?? 0
  }
  
  copy(update?: PieceDataOpt) {
    return new Piece({
      id: update?.id ?? this.id,
      type: update?.type ?? this.type,
      x: update?.x ?? this.x,
      y: update?.y ?? this.y,
      blocks: update?.blocks ?? this.blocks,
      rotI: update?.rotI ?? this.rotI,
    })
  }
  
  ;*[Symbol.iterator](): IterableIterator<PieceBlock> {
    const { x, y, blocks: b } = this
    for (const block of blocksIterator(b)) {
      // xb & yb - x & y in block
      const { x: xb, y: yb, blockValue } = block
      // xp & yp - x & y in piece
      const blockInPiece = { x: x + xb, y: y + yb, xp: xb, yp: yb, blockValue }
      yield blockInPiece
    }
  }
  
  get rows() { return blocksRows(this.blocks) }
  get cols() { return blocksCols(this.blocks) }
  get bounds() { return blocksGetBounds(this.blocks) }
  
  toTrimmed() {
    const bounds = this.bounds
    if (!bounds) return this.copy({ blocks: [] })
    const { xFirst, yFirst, xLast, yLast } = bounds
    return this.copy({
      x: this.x + xFirst, 
      y: this.y + yFirst,
      blocks: this.blocks.slice(yFirst, yLast + 1).map(it => it.slice(xFirst, xLast + 1)),
    })
  }
  
  toMoved(move: XydxdyOpt): Piece {
    const { x, y } = this
    const { x: x1, y: y1 } = moveXy(x, y, move)
    return this.copy({ x: x1, y: y1 })
  }
  toRotatedRight(): IterableIterator<Piece> { return pieceToRotated(this, 1) }
  toRotatedLeft(): IterableIterator<Piece> { return pieceToRotated(this, -1) }
  
  toGhost() { return this.copy({ type: `${this.type},Ghost` }) }
  
  ;*getBottomBlocks(): IterableIterator<PieceBlock> {
    const { x, y, blocks: b, rows, cols } = this
    for (let xb = 0; xb < cols; xb++) {
      for (let yb = rows - 1; yb >= 0; yb--) {
        const blockValue = b[yb][xb]
        if (blockValue) {
          const blockInPiece = { x: x + xb, y: y + yb, xp: xb, yp: yb, blockValue }
          yield blockInPiece
          break
        }
      }
    }
    
  }
}

export interface PieceData {
  id: Id
  type: PieceType
  x: number
  y: number
  blocks: PieceBlocks
  rotI: number
}
export type PieceDataOpt = Opt<PieceData>
export type PieceDataCtor = PartOpt<PieceData, 'rotI'>



// Uses mathematical rotation
export function *pieceToRotated(piece: Piece, direction: 1 | -1): IterableIterator<Piece> {
  const p = piece
  const { blocks, rotI } = mathRotate(p.blocks, p.rotI, direction)
  yield p.copy({ blocks, rotI })
}
