import { Field } from '@@/lib/tetris-engine/entities/field/model/field.ts'
import type { Piece } from '@@/lib/tetris-engine/entities/piece/model/piece.ts'
import { randomTetrominoSrs } from '@@/lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { matrixCopy } from '@@/lib/tetris-engine/shared/utils/matrix.ts'



export class Tetris {
  field: Field = Field.empty(10, 24, 0, 4)
  
  current: Piece | undefined = randomTetrominoSrs()
  next: Piece = randomTetrominoSrs()
  
  
  copy() {
    const t = new Tetris()
    t.field = this.field.copy()
    t.current = this.current
    t.next = this.next
    return t
  }
  
  
  moveCurrentPieceLeft() {
    const curr = this.current
    if (curr) {
      const moved = curr.toMoved({ dx: -1 })
      this.tryPlaceNewCurrentPiece(moved)
    }
  }
  moveCurrentPieceRight() {
    const curr = this.current
    if (curr) {
      const moved = curr.toMoved({ dx: 1 })
      this.tryPlaceNewCurrentPiece(moved)
    }
  }
  moveCurrentPieceDown() {
    const curr = this.current
    if (curr) {
      const moved = curr.toMoved({ dy: 1 })
      this.tryPlaceNewCurrentPiece(moved)
    }
  }
  moveCurrentPieceUp() {
    const curr = this.current
    if (curr) {
      const moved = curr.toMoved({ dy: -1 })
      this.tryPlaceNewCurrentPiece(moved)
    }
  }
  rotateCurrentPieceLeft() {
    const curr = this.current
    if (curr) for (const rotated of curr.toRotatedLeft()) {
      if (this.tryPlaceNewCurrentPiece(rotated)) return
    }
  }
  rotateCurrentPieceRight() {
    const curr = this.current
    if (curr) for (const rotated of curr.toRotatedRight()) {
      if (this.tryPlaceNewCurrentPiece(rotated)) return
    }
  }
  dropCurrentPiece() {
    const curr = this.current
    if (curr) {
      const { x: px, y: py } = curr
      const { fyEnd } = this.field
      let freeY = fyEnd
      for (const bottomBlock of curr.getBottomBlocks()) {
        const { x: bpx, y: bpy } = bottomBlock
        const bfx = px + bpx, bfy = py + bpy
        const firstBlockUnder = this.field.firstBlockUnder(bfx, bfy)
        if (firstBlockUnder) freeY = Math.min(freeY, firstBlockUnder.fy - bpy - 1)
      }
      
      const moved = curr.toMoved({ y: freeY })
      this.current = moved
    }
  }
  
  
  tryPlaceNewCurrentPiece(current: Piece): boolean {
    if (this.field.canPlacePiece(current)) {
      this.current = current
      return true
    }
    return false
  }
  
  
  lockCurrentPiece() {
    this.field.addPiece(this.current)
    this.current = undefined
  }
  
  getFullLines() { return this.field.getFullLines() }
  
  clearLines(linesFy: number[]) { this.field.clearLines(linesFy) }
  
  dropLines(linesFy: number[]) { this.field.dropLines(linesFy) }
  
  spawnNewPieceOrGameOver() {
    const spawned = this.trySpawnNewPiece()
    if (!spawned) throw new Error('GAME OVER')
  }
  
  
  trySpawnNewPiece(): boolean {
    if (this.field.canPlacePiece(this.next)) {
      this.current = this.next
      this.next = randomTetrominoSrs()
      return true
    }
    return false
  }
  
  
  get isCurrentPieceAboveField() { return !!this.current && this.current.toTrimmed().y < 0 }
  
  
  renderField() {
    const { y0, blocks } = this.field
    const f = Field.ofBlocks(matrixCopy(blocks).slice(y0), 0, 0)
    f.addPiece(this.current)
    return f
  }
  renderNextField() {
    const nextPiece = this.next.toTrimmed().toMoved({ x: 0, y: 0 })
    const f = Field.empty(nextPiece.cols, nextPiece.rows)
    f.addPiece(nextPiece)
    return f
  }
  renderCombinedField() {
    const { blocks, y0 } = this.field
    const f = Field.ofBlocks(matrixCopy(blocks).slice(y0 - 2), 0, 2)
    f.addPiece(this.next, this.isCurrentPieceAboveField ? 'Ghost' : undefined)
    f.addPiece(this.current)
    return f
  }
  
  
}
