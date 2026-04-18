import {
  tetroJLSTZSrsOffsets,
} from '@@/lib/tetris-engine/entities/piece/lib/offsets/tetroJLSTZSrsOffsets.ts'
import type { PieceSrsConfig } from '@@/lib/tetris-engine/entities/piece/model/pieceSrs.ts'



export const pieceZSrs: PieceSrsConfig = {
  type: 'Z',
  x: 4, y: -2,
  blocks: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  offsets: tetroJLSTZSrsOffsets,
}
