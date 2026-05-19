import type { Tetris } from '@@/lib/tetris/tetris-engine/entities/tetris/model/tetris.ts'



export type IngameStats = {
  hiScore: number
  score: number
  level: number
  lines: number
}

export type IngameData = IngameStats & {  tetris: Tetris }
