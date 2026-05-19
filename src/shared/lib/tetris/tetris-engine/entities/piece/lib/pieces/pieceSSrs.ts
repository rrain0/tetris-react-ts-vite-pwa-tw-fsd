import {
  tetroJLSTZSrsOffsets,
} from '@@/lib/tetris/tetris-engine/entities/piece/lib/offsets/tetroJLSTZSrsOffsets.ts'
import type { PieceSrsConfig } from '@@/lib/tetris/tetris-engine/entities/piece/model/pieceSrs.ts'
import { objectMapValues } from '@@/utils/object/objectMap.ts'



// →x ↓y
export const pieceSSrs: PieceSrsConfig = {
  type: 'S',
  x: 3, y: -2,
  blocks: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  offsets: objectMapValues(tetroJLSTZSrsOffsets, v => v.map(v => ({ ...v, y: -v.y }))),
}
