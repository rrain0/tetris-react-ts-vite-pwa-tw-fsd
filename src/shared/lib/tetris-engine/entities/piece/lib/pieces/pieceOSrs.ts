import { tetroOSrsOffsets } from '@lib/tetris-engine/entities/piece/lib/offsets/tetroOSrsOffsets.ts'
import type { PieceSrsConfig } from '@lib/tetris-engine/entities/piece/model/pieceSrs.ts'



export const pieceOSrs: PieceSrsConfig = {
  xy: [3, 19],
  position: [
    [0, 1, 1],
    [0, 1, 1],
    [0, 0, 0],
  ],
  offsets: tetroOSrsOffsets,
}

