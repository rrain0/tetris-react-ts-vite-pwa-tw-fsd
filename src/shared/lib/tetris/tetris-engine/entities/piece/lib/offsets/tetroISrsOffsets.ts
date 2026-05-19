import type { OffsetsSrs } from '@@/lib/tetris/tetris-engine/entities/piece/model/pieceSrs.ts'



// →x ↑y
export const tetroISrsOffsets: OffsetsSrs = {
  '0': [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
  ],
  'R': [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -2 },
  ],
  '2': [
    { x: -1, y: 1 },
    { x: 1, y: 1 },
    { x: -2, y: 1 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
  ],
  'L': [
    { x: 0, y: 1 },
    { x: 0, y: 1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 0, y: 2 },
  ],
}
