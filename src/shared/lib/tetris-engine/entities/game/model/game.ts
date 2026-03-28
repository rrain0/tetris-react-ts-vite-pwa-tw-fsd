import { Field } from '@lib/tetris-engine/entities/field/model/field.ts'
import type { Piece } from '@lib/tetris-engine/entities/piece/model/piece.ts'
import { randomTetrominoSrs } from '@lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { matrixCopy } from '@lib/tetris-engine/shared/utils/matrix.ts'



const linesToLvlUp = 10
const startLevel = 0



export class Game {
  lines = 0
  score = 0
  
  level = 0
  
  field: Field = new Field()
  
  current: Piece = randomTetrominoSrs()
  next: Piece = randomTetrominoSrs()
  
  
  spawnNewPiece() {
    if (this.field.canPlacePiece(this.next)) {
      this.current = this.next
      this.next = randomTetrominoSrs()
    }
    else {
      throw new Error('GAME OVER')
    }
  }
  
  
  moveCurrentPieceLeft() {
    const moved = this.current.toMoved([-1, 0])
    this.tryPlaceNewCurrentPiece(moved)
  }
  moveCurrentPieceRight() {
    const moved = this.current.toMoved([1, 0])
    this.tryPlaceNewCurrentPiece(moved)
  }
  moveCurrentPieceDown() {
    const moved = this.current.toMoved([0, 1])
    this.tryPlaceNewCurrentPiece(moved)
  }
  moveCurrentPieceUp() {
    const moved = this.current.toMoved([0, -1])
    this.tryPlaceNewCurrentPiece(moved)
  }
  rotateCurrentPieceLeft() {
    for (const rotated of this.current.toRotatedLeft()) {
      if (this.tryPlaceNewCurrentPiece(rotated)) return
    }
  }
  rotateCurrentPieceRight() {
    for (const rotated of this.current.toRotatedRight()) {
      if (this.tryPlaceNewCurrentPiece(rotated)) return
    }
  }
  // Only drop, does not apply any lock or delay
  dropCurrentPiece() {
    const { blocks } = this.field
    const { xy: [x, y], position: p } = this.current
    let freeY = blocks.length
    // Find first bottom piece block
    for (let xp = 0; xp < p[0].length; xp++) {
      for (let yp = p.length - 1; yp >= 0; yp--) {
        const element = p[yp][xp]
        if (element) {
          // Find first field block under piece block
          for (let by = y + yp + 1; by < blocks.length; by++) {
            if (blocks[by][x + xp]) { freeY = Math.min(by - 1 - yp, freeY); break }
          }
          break
        }
      }
    }
    const moved = this.current.toMoved([0, freeY - y])
    this.tryPlaceNewCurrentPiece(moved)
  }
  
  
  tryPlaceNewCurrentPiece(current: Piece): boolean {
    if (this.field.canPlacePiece(current)) {
      this.current = current
      return true
    }
    return false
  }
  
  
  renderField() {
    const f = new Field()
    f.blocks = matrixCopy(this.field.blocks)
    f.addPiece(this.current)
    return f
  }
  
  
}
