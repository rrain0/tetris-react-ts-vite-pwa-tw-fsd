import { Field } from '@lib/tetris-engine/entities/field/model/field.ts'
import type { Piece } from '@lib/tetris-engine/entities/piece/model/piece.ts'
import { randomTetrominoSrs } from '@lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { matrixCopy } from '@lib/tetris-engine/shared/utils/matrix.ts'
import { array } from '@utils/array/arrCreate.ts'



const linesToLvlUp = 10
const startLevel = 0



export class Game {
  lines = 0
  score = 0
  
  level = 0
  
  field: Field = Field.empty(10, 20)
  
  current: Piece = randomTetrominoSrs()
  next: Piece = randomTetrominoSrs()
  
  
  copy() {
    const g = new Game()
    g.lines = this.lines
    g.score = this.score
    g.level = this.level
    g.field = Field.ofBlocks(matrixCopy(this.field.blocks))
    g.current = this.current
    g.next = this.next
    return g
  }
  
  
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
    const moved = this.current.toMoved({ dx: -1 })
    this.tryPlaceNewCurrentPiece(moved)
  }
  moveCurrentPieceRight() {
    const moved = this.current.toMoved({ dx: 1 })
    this.tryPlaceNewCurrentPiece(moved)
  }
  moveCurrentPieceDown() {
    const moved = this.current.toMoved({ dy: 1 })
    this.tryPlaceNewCurrentPiece(moved)
  }
  moveCurrentPieceUp() {
    const moved = this.current.toMoved({ dy: -1 })
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
  hardDropCurrentPiece() {
    const { blocks } = this.field
    const { xy: [x, y], blocks: b } = this.current
    let freeY = blocks.length
    // Find first bottom piece block
    for (let xb = 0; xb < b[0].length; xb++) {
      for (let yb = b.length - 1; yb >= 0; yb--) {
        const element = b[yb][xb]
        if (element) {
          // Find first field block under piece block
          for (let by = y + yb + 1; by < blocks.length; by++) {
            if (blocks[by][x + xb]) { freeY = Math.min(by - 1 - yb, freeY); break }
          }
          break
        }
      }
    }
    const moved = this.current.toMoved({ y: freeY })
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
    const f = Field.ofBlocks(matrixCopy(this.field.blocks))
    f.addPiece(this.current)
    return f
  }
  renderNextField() {
    const n = this.next
    const f = Field.empty(4, 2)
    const nextPiece = n.toMoved({ x: -n.firstNonEmptyCol, y: -n.firstNonEmptyRow })
    f.addPiece(nextPiece)
    return f
  }
  renderCombinedField() {
    const { blocks, cols, rows } = this.field
    const f = Field.empty(cols, rows + 2)
    f.blocks = [
      array(cols, null),
      array(cols, null),
      ...matrixCopy(blocks),
    ]
    f.addPiece(this.current)
    return f
  }
  
  
}
