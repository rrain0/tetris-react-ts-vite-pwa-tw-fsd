import { blockSizes } from '@/widgets/tetris-field/entities/block/ui/blockSizes.ts'
import { fracToCqh } from '@@/utils/css/sz.ts'



const fieldCols = 10
const fieldRows = 20
const nextCols = 4



export const ingameScreenLandSmSizes = (() => {
  const block = { sz: 1.0 }
  
  const field = (() => {
    const blockP = (() => {
      const { blockInFigure: blk } = blockSizes
      return blk.szOfFsz(blk.outsetSz) * block.sz
    })()
    const w = blockP + fieldCols * block.sz + blockP
    const h =  blockP + fieldRows * block.sz + blockP
    return { w, h, blockP }
  })()
  
  const fieldBox = (() => {
    const bdSz = 0.16
    const w = bdSz + field.w + bdSz
    const h = bdSz + field.h + bdSz
    return { bdSz, w, h }
  })()
  
  const side = (() => {
    const w = 6 * block.sz
    const g = 0.35
    const next = { w: field.blockP + nextCols * block.sz + field.blockP }
    const title = { h: 0.8 }
    const digit = { h: 0.9 }
    return { w, g, next, title, digit }
  })()
  
  const gameControls = (() => {
    const g = 0.3
    const ic = { sz: 1 }
    const w = ic.sz + g + ic.sz
    return { w, g, ic }
  })()
  
  const game = (() => {
    const g = 0.5
    const w = fieldBox.w + g + side.w + g + gameControls.w
    const h = fieldBox.h
    const ratio = w / h
    return { w, h, g, ratio }
  })()
  
  const wOfFh = (w: number) => w / game.h
  const hOfFh = (h: number) => h / game.h
  
  const wInCqh = (w: number) => fracToCqh(wOfFh(w))
  const hInCqh = (h: number) => fracToCqh(hOfFh(h))
  
  const wInPxh = (w: number, pxh: number) => wOfFh(w) * pxh
  
  return {
    block, field, fieldBox, side, gameControls, game,
    wInCqh, hInCqh, wInPxh,
  }
})()
