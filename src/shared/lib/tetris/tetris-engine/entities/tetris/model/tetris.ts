import { Field } from '@@/lib/tetris/tetris-engine/entities/field/model/field.ts'
import type { Piece } from '@@/lib/tetris/tetris-engine/entities/piece/model/piece.ts'
import {
  randomTetrominoSrs,
} from '@@/lib/tetris/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { matrixCopy } from '@@/lib/tetris/tetris-engine/shared/utils/matrix.ts'



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
  
  
  moveLeft(): boolean {
    const curr = this.current
    if (curr) {
      const moved = curr.toMoved({ dx: -1 })
      return this.placeNewCurrentPiece(moved)
    }
    return false
  }
  moveRight(): boolean {
    const curr = this.current
    if (curr) {
      const moved = curr.toMoved({ dx: 1 })
      return this.placeNewCurrentPiece(moved)
    }
    return false
  }
  moveDown(): boolean {
    const curr = this.current
    if (curr) {
      const moved = curr.toMoved({ dy: 1 })
      return this.placeNewCurrentPiece(moved)
    }
    return false
  }
  moveUp(): boolean {
    const curr = this.current
    if (curr) {
      const moved = curr.toMoved({ dy: -1 })
      return this.placeNewCurrentPiece(moved)
    }
    return false
  }
  rotateLeft(): boolean {
    const curr = this.current
    if (curr) for (const rotated of curr.toRotatedLeft()) {
      if (this.placeNewCurrentPiece(rotated)) return true
    }
    return false
  }
  rotateRight(): boolean {
    const curr = this.current
    if (curr) for (const rotated of curr.toRotatedRight()) {
      if (this.placeNewCurrentPiece(rotated)) return true
    }
    return false
  }
  fallBy(blocksCnt?: number): number {
    const curr = this.current
    if (curr) {
      const { x: px, y: py } = curr
      const { fyEnd } = this.field
      
      let dyMax = blocksCnt ?? Number.POSITIVE_INFINITY
      let foundDy: number | undefined
      for (const bottomBlock of curr.getBottomBlocks()) {
        const { x: bpx, y: bpy } = bottomBlock
        const bfx = px + bpx, bfy = py + bpy
        dyMax = Math.min(dyMax, fyEnd - 1 - bpy)
        const collision = this.field.firstCollisionBelow(bfx, bfy)
        if (collision) {
          const dy = collision.fy - 1 - bfy
          foundDy = Math.min(foundDy ?? dy, dy, dyMax)
        }
      }
      
      if (foundDy) {
        this.current = curr.toMoved({ dy: foundDy })
        return foundDy
      }
    }
    return 0
  }
  canMoveDown(): boolean {
    const curr = this.current
    if (curr) {
      const moved = curr.toMoved({ dy: 1 })
      return this.field.canPlacePiece(moved)
    }
    return false
  }
  
  
  placeNewCurrentPiece(current: Piece): boolean {
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
  
  
  spawnNewPiece(): boolean {
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
