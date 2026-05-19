import {
  blocksCols,
  blocksRows,
} from '@@/lib/tetris/tetris-engine/entities/piece/model/block.ts'
import type { Piece, PieceType } from '@@/lib/tetris/tetris-engine/entities/piece/model/piece.ts'
import { matrixCopy } from '@@/lib/tetris/tetris-engine/shared/utils/matrix.ts'
import type { Id } from '@@/utils/app/id.ts'
import { array } from '@@/utils/array/arrCreate.ts'



export type FieldBlockType = 'Next' | 'NextGhost'
export type FieldBlockPresent = {
  id: Id
  type?: FieldBlockType | undefined
  pieceId: Id
  pieceType: PieceType
}
export type FieldBlock = FieldBlockPresent | null
export type FieldBlocks = FieldBlock[][]
export type FieldCoords = { x: number, y: number, fx: number, fy: number }
export type FieldCoordBlock = FieldCoords & { value: FieldBlock }
export type FieldCoordBlockPresent = FieldCoords & { value: FieldBlockPresent }



// →x ↓y
export class Field {
  x0: number; y0: number
  blocks: FieldBlocks
  
  private constructor() { }
  static empty(cols: number, rows: number, x0 = 0, y0 = 0) {
    const it = new Field()
    it.x0 = x0
    it.y0 = y0
    it.blocks = array(rows).map(() => array<FieldBlock>(cols, null))
    return it
  }
  static ofBlocks(blocks: FieldBlock[][], x0 = 0, y0 = 0) {
    const it = new Field()
    it.x0 = x0
    it.y0 = y0
    it.blocks = blocks
    return it
  }
  
  copy() {
    const it = new Field()
    it.x0 = this.x0
    it.y0 = this.y0
    it.blocks = matrixCopy(this.blocks)
    return it
  }
  
  get rows() { return blocksRows(this.blocks) }
  get cols() { return blocksCols(this.blocks) }
  get fx0() { return this.x0 }
  get fy0() { return this.y0 }
  get fxStart() { return -this.fx0 }
  get fyStart() { return -this.fy0 }
  get fxEnd() { return this.cols - this.fx0 }
  get fyEnd() { return this.rows - this.fy0 }
  
  
  ;*blocksIterator(): IterableIterator<FieldCoordBlock> {
    const { blocks: b, rows, cols, fx0, fy0 } = this
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const fx = x - fx0, fy = y - fy0
      yield { x, y, fx, fy, value: b[y][x] }
    }
  }
  
  ;*blocksPresentIterator(): IterableIterator<FieldCoordBlockPresent> {
    const { blocks: b, rows, cols, fx0, fy0 } = this
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const value = b[y][x]
      const fx = x - fx0, fy = y - fy0
      if (value) yield { x, y, fx, fy, value }
    }
  }
  
  ;[Symbol.iterator](): IterableIterator<FieldCoordBlock> { return this.blocksIterator() }
  
  
  
  get bottomEmpty() {
    return this.blocks.at(-1)?.every(it => !it) ?? true
  }
  
  hasAnyBlocksAtOrAbove(atOrAboveFy: number) {
    const { fyStart, fy0 } = this
    for (let fy = fyStart; fy <= atOrAboveFy; fy++) {
      const y = fy + fy0
      for (const value of this.blocks[y]) if (value) return true
    }
    return false
  }
  
  firstCollisionBelow(fx: number, fy: number): FieldCoords | null {
    const { fx0, fy0, fyEnd } = this
    for (fy++; fy <= fyEnd; fy++) {
      const x = fx0 + fx, y = fy0 + fy
      if (fy === fyEnd || this.blocks[y]?.[x]) return { x, y, fx, fy }
    }
    return null
  }
  
  canPlacePiece(piece: Piece): boolean {
    const { fx0, fy0, fxStart, fxEnd, fyEnd } = this
    const { x: px, y: py } = piece
    
    for (const pieceBlock of piece.blocksPresentIterator()) {
      const { x: bpx, y: bpy } = pieceBlock
      const bfx = px + bpx, bfy = py + bpy
      if (bfx < fxStart || bfx >= fxEnd || bfy >= fyEnd) return false
      const x = fx0 + bfx, y = fy0 + bfy
      const fieldBlockValue = this.blocks[y]?.[x]
      if (fieldBlockValue) return false
    }
    return true
  }
  
  
  
  addPiece(piece?: Piece, type?: FieldBlockType, underlay = false) {
    if (!piece) return
    const { fx0, fy0, fxStart, fyStart, fxEnd, fyEnd } = this
    const { x: px, y: py, type: pieceType, id: pieceId } = piece
    
    for (const pieceBlock of piece.blocksPresentIterator()) {
      const { x: bpx, y: bpy, value: { id } } = pieceBlock
      const bfx = px + bpx, bfy = py + bpy
      if (bfx >= fxStart && bfx < fxEnd && bfy >= fyStart && bfy < fyEnd) {
        const x = fx0 + bfx, y = fy0 + bfy
        if (underlay && this.blocks[y][x]) continue
        this.blocks[y][x] = { id, type, pieceId, pieceType }
      }
    }
  }
  
  
  
  getFullLines(): number[] {
    const linesFy = []
    const { blocks: b, rows, cols, fy0 } = this
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const fy = y - fy0
      const value = b[y][x]
      if (!value) break
      if (x === cols - 1) { linesFy.push(fy); break }
    }
    return linesFy
  }
  
  clearLines(linesFy: number[]) {
    const { fy0 } = this
    for (const fy of linesFy) this.blocks[fy + fy0].fill(null)
  }
  
  removeLines(linesFy: number[]) {
    const { blocks: b, cols, rows, fy0 } = this
    
    function replaceLine(line: number, from: number) {
      if (from >= 0) b[line].splice(0, cols, ...b[from])
      else b[line].fill(null)
    }
    
    const linesY = linesFy.map(fy => fy0 + fy)
    for (let y = rows - 1, up = 0; y + up >= 0; y--) {
      const drop = linesY.includes(y)
      if (!drop && up) replaceLine(y + up, y)
      if (drop) { replaceLine(y + up, y - 1); up++ }
    }
  }
  
}
