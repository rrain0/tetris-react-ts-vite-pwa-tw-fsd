import { tetroISrsOffsets } from '@lib/tetris-engine/entities/piece/lib/offsets/tetroISrsOffsets.ts'
import type { PieceSrsConfig } from '@lib/tetris-engine/entities/piece/model/pieceSrs.ts'



export const pieceISrs: PieceSrsConfig = {
  xy: [2, 20],
  position: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  offsets: tetroISrsOffsets,
}

