import {
  blocksCols,
  blocksIterator,
  blocksRows,
} from '@lib/tetris-engine/entities/piece/model/block.ts'
import type { Piece } from '@lib/tetris-engine/entities/piece/model/piece.ts'
import type { Id } from '@utils/app/id.ts'
import { array } from '@utils/array/arrCreate.ts'



export type FieldPieceBlock = { type: Id, pieceId: Id }
export type FieldBlock = FieldPieceBlock | null



export class Field {
  blocks: FieldBlock[][]
  
  constructor(cols = 10, rows = 20) {
    this.blocks =  array(rows).map(() => array<FieldBlock>(cols, null))
  }
  
  get rows() { return blocksRows(this.blocks) }
  get cols() { return blocksCols(this.blocks) }
  
  ;[Symbol.iterator]() { return blocksIterator(this.blocks) }
  
  
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
