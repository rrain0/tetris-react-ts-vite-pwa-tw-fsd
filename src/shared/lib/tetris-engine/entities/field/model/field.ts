import {
  type Block,
  blocksCols,
  blocksIterator,
  blocksRows,
} from '@@/lib/tetris-engine/entities/piece/model/block.ts'
import type { Piece, PieceType } from '@@/lib/tetris-engine/entities/piece/model/piece.ts'
import type { Id } from '@@/utils/app/id.ts'
import { array } from '@@/utils/array/arrCreate.ts'



export type FieldPieceBlockValue = { type: PieceType, pieceId: Id }
export type FieldBlockValue = FieldPieceBlockValue | null
export type FieldBlock = Block<FieldBlockValue>



export class Field {
  blocks: FieldBlockValue[][]
  
  private constructor() { }
  static empty(cols = 10, rows = 20) {
    const f = new Field()
    f.blocks = array(rows).map(() => array<FieldBlockValue>(cols, null))
    return f
  }
  static ofBlocks(blocks: FieldBlockValue[][]) {
    const f = new Field()
    f.blocks = blocks
    return f
  }
  
  get rows() { return blocksRows(this.blocks) }
  get cols() { return blocksCols(this.blocks) }
  
  ;[Symbol.iterator](): IterableIterator<FieldBlock> { return blocksIterator(this.blocks) }
  
  
  firstBlockUnder(x: number, y: number) {
    y++
    for ( ; y < this.rows; y++) {
      const blockValue = this.blocks[y][x]
      if (blockValue) return { x, y, blockValue }
    }
    return null
  }
  
  canPlacePiece(piece: Piece): boolean {
    for (const pieceBlock of piece) {
      const { x, y, blockValue: pieceBlockValue } = pieceBlock
      if (pieceBlockValue) {
        if (x < 0 || x >= this.cols || y >= this.rows) return false
        const fieldBlockValue = this.blocks[y]?.[x]
        if (fieldBlockValue) return false
      }
    }
    return true
  }
  
  addPiece(piece: Piece) {
    const { type, id } = piece
    for (const pieceBlock of piece) {
      const { x, y, blockValue } = pieceBlock
      if (blockValue && y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
        this.blocks[y][x] = { type, pieceId: id }
      }
    }
  }
  
  // addBlocks
  
  // hasLines
  
  // clearLines
  
}
