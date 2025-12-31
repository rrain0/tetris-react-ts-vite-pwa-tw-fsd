import { pieceISrs } from '@lib/tetris-engine/entities/piece/lib/pieces/pieceISrs.ts'
import { pieceJSrs } from '@lib/tetris-engine/entities/piece/lib/pieces/pieceJSrs.ts'
import { pieceLSrs } from '@lib/tetris-engine/entities/piece/lib/pieces/pieceLSrs.ts'
import { pieceOSrs } from '@lib/tetris-engine/entities/piece/lib/pieces/pieceOSrs.ts'
import { pieceSSrs } from '@lib/tetris-engine/entities/piece/lib/pieces/pieceSSrs.ts'
import { pieceTSrs } from '@lib/tetris-engine/entities/piece/lib/pieces/pieceTSrs.ts'
import { pieceZSrs } from '@lib/tetris-engine/entities/piece/lib/pieces/pieceZSrs.ts'
import { PieceSrs } from '@lib/tetris-engine/entities/piece/model/pieceSrs.ts'
import { randomInArray } from '@utils/random/randomInArray.ts'
import * as uuid from 'uuid'



export function newISrs(id = uuid.v4(), xy = pieceISrs.xy) {
  return new PieceSrs(id, 'I', xy, pieceISrs.position, pieceISrs.offsets)
}
export function newJSrs(id = uuid.v4(), xy = pieceJSrs.xy) {
  return new PieceSrs(id, 'J', xy, pieceJSrs.position, pieceJSrs.offsets)
}
export function newLSrs(id = uuid.v4(), xy = pieceLSrs.xy) {
  return new PieceSrs(id, 'L', xy, pieceLSrs.position, pieceLSrs.offsets)
}
export function newOSrs(id = uuid.v4(), xy = pieceOSrs.xy) {
  return new PieceSrs(id, 'O', xy, pieceOSrs.position, pieceOSrs.offsets)
}
export function newSSrs(id = uuid.v4(), xy = pieceSSrs.xy) {
  return new PieceSrs(id, 'S', xy, pieceSSrs.position, pieceSSrs.offsets)
}
export function newTSrs(id = uuid.v4(), xy = pieceTSrs.xy) {
  return new PieceSrs(id, 'T', xy, pieceTSrs.position, pieceTSrs.offsets)
}
export function newZSrs(id = uuid.v4(), xy = pieceZSrs.xy) {
  return new PieceSrs(id, 'Z', xy, pieceZSrs.position, pieceZSrs.offsets)
}



export function randomTetrominoSrs() {
  return randomInArray([
    newISrs, newJSrs, newLSrs,
    newOSrs, newSSrs, newTSrs,
    newZSrs,
  ])()
}
