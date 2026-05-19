import {
  tetroISrsOffsets,
} from '@@/lib/tetris/tetris-engine/entities/piece/lib/offsets/tetroISrsOffsets.ts'
import type { PieceSrsConfig } from '@@/lib/tetris/tetris-engine/entities/piece/model/pieceSrs.ts'
import { objectMapValues } from '@@/utils/object/objectMap.ts'



// →x ↓y
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
  offsets: objectMapValues(tetroISrsOffsets, v => v.map(v => ({ ...v, y: -v.y }))),
}
