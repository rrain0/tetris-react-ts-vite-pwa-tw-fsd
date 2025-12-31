import {
  tetroJLSTZSrsOffsets
} from '@lib/tetris-engine/entities/piece/lib/offsets/tetroJLSTZSrsOffsets.ts'
import type { PieceSrsConfig } from '@lib/tetris-engine/entities/piece/model/pieceSrs.ts'



export const pieceJSrs: PieceSrsConfig = {
  xy: [2, 17],
  position: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  offsets: tetroJLSTZSrsOffsets,
}

