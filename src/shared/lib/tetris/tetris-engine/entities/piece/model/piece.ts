import {
  type Block,
  blocksCols, blocksGetBounds,
  blocksRows,
} from '@@/lib/tetris/tetris-engine/entities/piece/model/block.ts'
import { mathRotate, moveXy } from '@@/lib/tetris/tetris-engine/shared/utils/piece.ts'
import type { Id } from '@@/utils/app/id.ts'
import type { XydxdyOpt } from '@@/utils/math/rect.ts'
import type { Opt, OptKeys } from '@@/utils/ts/ts.ts'



export type PieceBlockPresent = { id: Id }
export type PieceBlock = PieceBlockPresent | null
export type PieceBlocks = PieceBlock[][]
export type PieceCoordBlock = Block<PieceBlock>
export type PieceCoordBlockPresent = Block<PieceBlockPresent>



export type PieceType = string


// →x ↓y
export class Piece {
  id: Id
  type: PieceType
  x: number; y: number
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
  
  get rows() { return blocksRows(this.blocks) }
  get cols() { return blocksCols(this.blocks) }
  get bounds() { return blocksGetBounds(this.blocks) }
  
  ;*blocksIterator(): IterableIterator<PieceCoordBlock> {
    const { blocks: b, rows, cols } = this
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      yield { x, y, value: b[y][x] }
    }
  }
  
  ;*blocksPresentIterator(): IterableIterator<PieceCoordBlockPresent> {
    const { blocks: b, rows, cols } = this
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const value = b[y][x]
      if (value) yield { x, y, value }
    }
  }
  
  ;[Symbol.iterator](): IterableIterator<PieceCoordBlock> { return this.blocksIterator() }
  
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
  
  ;*getBottomBlocks(): IterableIterator<PieceCoordBlock> {
    const { blocks: b, rows, cols } = this
    for (let x = 0; x < cols; x++) for (let y = rows - 1; y >= 0; y--) {
      const value = b[y][x]
      if (value) yield { x, y, value }
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
export type PieceDataCtor = OptKeys<PieceData, 'rotI'>



// Uses mathematical rotation
export function *pieceToRotated(piece: Piece, direction: 1 | -1): IterableIterator<Piece> {
  const p = piece
  const { blocks, rotI } = mathRotate(p.blocks, p.rotI, direction)
  yield p.copy({ blocks, rotI })
}
