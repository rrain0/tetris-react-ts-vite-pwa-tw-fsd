import {
  type Block,
  blocksCols,
  blocksRows,
} from '@@/lib/tetris-engine/entities/piece/model/block.ts'
import type { Piece, PieceType } from '@@/lib/tetris-engine/entities/piece/model/piece.ts'
import type { Id } from '@@/utils/app/id.ts'
import { array } from '@@/utils/array/arrCreate.ts'




export type FieldBlockType = 'Ghost'
export type FieldBlockPresent = {
  id: Id
  type?: FieldBlockType | undefined
  pieceId: Id
  pieceType: PieceType
}
export type FieldBlock = FieldBlockPresent | null
export type FieldBlocks = FieldBlock[][]
export type FieldCoordBlock = Block<FieldBlock>
export type FieldCoordBlockPresent = Block<FieldBlockPresent>



export class Field {
  blocks: FieldBlocks
  
  private constructor() { }
  static empty(cols = 10, rows = 20) {
    const f = new Field()
    f.blocks = array(rows).map(() => array<FieldBlock>(cols, null))
    return f
  }
  static ofBlocks(blocks: FieldBlock[][]) {
    const f = new Field()
    f.blocks = blocks
    return f
  }
  
  get rows() { return blocksRows(this.blocks) }
  get cols() { return blocksCols(this.blocks) }
  
  ;*blocksIterator(): IterableIterator<FieldCoordBlock> {
    const { blocks: b, rows, cols } = this
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      yield { x, y, value: b[y][x] }
    }
  }
  
  ;*blocksPresentIterator(): IterableIterator<FieldCoordBlockPresent> {
    const { blocks: b, rows, cols } = this
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const value = b[y][x]
      if (value) yield { x, y, value }
    }
  }
  
  ;[Symbol.iterator](): IterableIterator<FieldCoordBlock> { return this.blocksIterator() }
  
  
  firstBlockUnder(x: number, y: number): FieldCoordBlockPresent | null {
    y++
    for (; y < this.rows; y++) {
      const value = this.blocks[y][x]
      if (value) return { x, y, value }
    }
    return null
  }
  
  canPlacePiece(piece: Piece): boolean {
    const { x: fx0, y: fy0 } = piece
    for (const pieceBlock of piece) {
      const { x: px, y: py, value: pieceBlockValue } = pieceBlock
      if (pieceBlockValue) {
        const x = fx0 + px, y = fy0 + py
        if (x < 0 || x >= this.cols || y >= this.rows) return false
        const fieldBlockValue = this.blocks[y]?.[x]
        if (fieldBlockValue) return false
      }
    }
    return true
  }
  
  addPiece(piece: Piece, type?: FieldBlockType) {
    const { x: fx0, y: fy0, type: pieceType, id: pieceId } = piece
    for (const pieceBlock of piece.blocksPresentIterator()) {
      const { x: px, y: py, value: { id } } = pieceBlock
      const x = fx0 + px, y = fy0 + py
      if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
        this.blocks[y][x] = { id, type, pieceId, pieceType }
      }
    }
  }
  
  // addBlocks
  
  // hasLines
  
  // clearLines
  
}
