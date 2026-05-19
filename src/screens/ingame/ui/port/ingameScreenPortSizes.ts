import { blockSizes } from '@/widgets/tetris-field/entities/block/ui/blockSizes.ts'
import { fracToCqw } from '@@/utils/css/sz.ts'



const fieldCols = 10
const fieldRows = 20
const nextRows = 2
const comboRows = fieldRows + nextRows



export const ingameScreenPortSizes = (() => {
  const block = { sz: 1.0 }
  
  const field = (() => {
    const blockP = (() => {
      const { blockInFigure: blk } = blockSizes
      return blk.szOfFsz(blk.outsetSz) * block.sz
    })()
    const w = blockP + fieldCols * block.sz + blockP
    const h = blockP + fieldRows * block.sz + blockP
    
    return { w, h, blockP }
  })()
  
  const fieldBox = (() => {
    const bdSz = 0.16
    const w = bdSz + field.w + bdSz
    const h = bdSz + field.h + bdSz
    return { bdSz, w, h }
  })()
  
  const comboField = (() => {
    const blockP = (() => {
      const { blockInFigure: blk } = blockSizes
      return blk.szOfFsz(blk.outsetSz) * block.sz
    })()
    const w = blockP + fieldCols * block.sz + blockP
    const h = blockP + comboRows * block.sz + blockP
    return { w, h, blockP }
  })()
  
  const comboFieldBox = (() => {
    const bdSz = fieldBox.bdSz
    const h = comboField.h + bdSz
    return { h, bdSz }
  })()
  
  const top = (() => {
    const h = comboFieldBox.h - fieldBox.h
    
    const titleBox = (() => {
      const w = 3 * block.sz
      const h = 1 * block.sz
      
      return { w, h }
    })()
    
    const title = { h: 0.7 }
    
    return { h, titleBox, title }
  })()
  
  const bottom = (() => {
    const g = 0.2
    const h = g + 0.5 * block.sz + g + 0.5 * block.sz + g
    
    const title = { h: 0.5 }
    const digit = { h: 0.5 }
    const tx = { g: 0.16 }
    
    return { h, g, title, digit, tx }
  })()
  
  const gameControls = (() => {
    const ic = { sz: 1 }
    const g = 0.3
    const w = ic.sz + g + ic.sz
    return { w, g, ic }
  })()
  
  const game = (() => {
    const w = fieldBox.w
    const h = top.h + fieldBox.h + bottom.h
    const ratio = w / h
    return { w, h, ratio }
  })()
  
  const wOfFw = (w: number) => w / game.w
  const hOfFw = (h: number) => h / game.w
  
  const wInCqw = (w: number) => fracToCqw(wOfFw(w))
  const hInCqw = (h: number) => fracToCqw(hOfFw(h))
  
  const hInPxw = (h: number, pxw: number) => hOfFw(h) * pxw
  
  return {
    block, fieldBox, comboField, comboFieldBox, top, bottom, gameControls, game,
    wInCqw, hInCqw, hInPxw,
  }
})()
