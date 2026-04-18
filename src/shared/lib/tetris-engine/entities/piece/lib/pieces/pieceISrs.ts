import {
  tetroISrsOffsets,
} from '@@/lib/tetris-engine/entities/piece/lib/offsets/tetroISrsOffsets.ts'
import type { PieceSrsConfig } from '@@/lib/tetris-engine/entities/piece/model/pieceSrs.ts'



export const pieceISrs: PieceSrsConfig = {
  type: 'I',
  x: 2, y: -3,
  blocks: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  offsets: tetroISrsOffsets,
}
