import type { Piece } from '@lib/tetris-engine/entities/piece/model/piece.ts'
import type { Id } from '@utils/app/id.ts'
import { array } from '@utils/array/arrCreate.ts'



export type PieceBlock = { type: Id, pieceId: Id }
export type FieldBlock = PieceBlock | null

export class Field {
  blocks: FieldBlock[][]
  
  constructor(rows = 20, cols = 10) {
    this.blocks =  array(rows).map(() => array<FieldBlock>(cols, null))
  }
  
  get rows() { return this.blocks.length }
  get cols() { return this.blocks[0].length }
  
  ;*[Symbol.iterator]() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const block = this.blocks[y][x]
        yield { x, y, block }
      }
    }
  }
  
  
  canPlacePiece(piece: Piece): boolean {
    for (const pieceBlock of piece) {
      const { x, y, element } = pieceBlock
      if (element) {
        if (x < 0 || x >= this.cols || y >= this.rows) return false
        const fieldBlock = this.blocks[y]?.[x]
        if (fieldBlock) return false
      }
    }
    return true
  }
  
  addPiece(piece: Piece) {
    const { type, id } = piece
    for (const pieceBlock of piece) {
      const { x, y, element } = pieceBlock
      if (element && y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
        this.blocks[y][x] = { type, pieceId: id }
      }
    }
  }
  
  // addBlocks
  
  // hasLines
  
  // clearLines
  
}
