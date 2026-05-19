import { pieceISrs } from '@@/lib/tetris/tetris-engine/entities/piece/lib/pieces/pieceISrs.ts'
import { pieceJSrs } from '@@/lib/tetris/tetris-engine/entities/piece/lib/pieces/pieceJSrs.ts'
import { pieceLSrs } from '@@/lib/tetris/tetris-engine/entities/piece/lib/pieces/pieceLSrs.ts'
import { pieceOSrs } from '@@/lib/tetris/tetris-engine/entities/piece/lib/pieces/pieceOSrs.ts'
import { pieceSSrs } from '@@/lib/tetris/tetris-engine/entities/piece/lib/pieces/pieceSSrs.ts'
import { pieceTSrs } from '@@/lib/tetris/tetris-engine/entities/piece/lib/pieces/pieceTSrs.ts'
import { pieceZSrs } from '@@/lib/tetris/tetris-engine/entities/piece/lib/pieces/pieceZSrs.ts'
import {
  PieceSrs,
  type PieceSrsConfig,
  type PieceSrsDataOpt,
} from '@@/lib/tetris/tetris-engine/entities/piece/model/pieceSrs.ts'
import { randomFromArray } from '@@/utils/random/randomFromArray.ts'
import * as uuid from 'uuid'



export const newISrs = (data?: PieceSrsDataOpt) => newPieceSrs(pieceISrs, data)
export const newJSrs = (data?: PieceSrsDataOpt) => newPieceSrs(pieceJSrs, data)
export const newLSrs = (data?: PieceSrsDataOpt) => newPieceSrs(pieceLSrs, data)
export const newOSrs = (data?: PieceSrsDataOpt) => newPieceSrs(pieceOSrs, data)
export const newSSrs = (data?: PieceSrsDataOpt) => newPieceSrs(pieceSSrs, data)
export const newTSrs = (data?: PieceSrsDataOpt) => newPieceSrs(pieceTSrs, data)
export const newZSrs = (data?: PieceSrsDataOpt) => newPieceSrs(pieceZSrs, data)



export function newPieceSrs(config: PieceSrsConfig, data?: PieceSrsDataOpt) {
  const p = config
  const {
    id = uuid.v4(),
    type = p.type,
    x = p.x,
    y = p.y,
    blocks = p.blocks.map(it => it.map(it => it ? { id: uuid.v4() } : null)),
    rotI = 0,
    offsets = p.offsets,
  } = data ?? { }
  return new PieceSrs({ id, type, x, y, blocks, rotI, offsets })
}



export function randomTetrominoSrs() {
  return randomFromArray([
    newISrs, newJSrs, newLSrs,
    newOSrs, newSSrs, newTSrs,
    newZSrs,
  ])()
}
