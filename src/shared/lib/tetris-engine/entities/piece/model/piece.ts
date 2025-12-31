import type { num2 } from '@lib/tetris-engine/shared/utils/array.ts'
import type { Id } from '@lib/tetris-engine/shared/utils/id.ts'



// Rectangular matrix
// → x
// ↓ y
export type Position = (0 | 1)[][]



export abstract class Piece {
  id: Id
  type: Id
  xy: num2
  position: Position
  rotI = 0
  
  protected constructor(
    id: Id,
    type: Id,
    xy: num2,
    position: Position,
  ) {
    this.id = id
    this.type = type
    this.xy = xy
    this.position = position
  }
  
  *[Symbol.iterator]() {
    const [x, y] = this.xy
    for (let yp = 0; yp < this.position.length; yp++) {
      for (let xp = 0; xp < this.position[yp].length; xp++) {
        const element = this.position[yp][xp]
        yield { x: x + xp, y: y + yp, xp, yp, element }
      }
    }
  }
  
  abstract toRotated(direction: number): Piece
}
