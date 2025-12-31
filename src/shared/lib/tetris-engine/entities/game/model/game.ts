import { Field } from '@lib/tetris-engine/entities/field/model/field.ts'
import type { Piece } from '@lib/tetris-engine/entities/piece/model/piece.ts'
import { randomTetrominoSrs } from '@lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'



const linesToLvlUp = 10
const startLevel = 0



export class Game {
  lines = 0
  score = 0
  
  level = 0
  
  field: Field = new Field()
  
  current: Piece = randomTetrominoSrs()
  next: Piece = randomTetrominoSrs()
  
  
  spawnPiece() {
    if (this.field.canPlacePiece(this.next)) {
      this.current = this.next
      this.next = randomTetrominoSrs()
    }
    else {
      'GAME OVER'
    }
  }
  
  
  
  
}
