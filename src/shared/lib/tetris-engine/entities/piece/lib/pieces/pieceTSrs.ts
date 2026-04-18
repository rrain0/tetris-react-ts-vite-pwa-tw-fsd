import {
  tetroJLSTZSrsOffsets,
} from '@@/lib/tetris-engine/entities/piece/lib/offsets/tetroJLSTZSrsOffsets.ts'
import type { PieceSrsConfig } from '@@/lib/tetris-engine/entities/piece/model/pieceSrs.ts'



export const pieceTSrs: PieceSrsConfig = {
  type: 'T',
  x: 4, y: -2,
  blocks: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  offsets: tetroJLSTZSrsOffsets,
}
