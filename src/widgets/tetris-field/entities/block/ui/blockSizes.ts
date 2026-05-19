import { fracToCqw, fracToPerc, szOf } from '@@/utils/css/sz.ts'
import type { StylePropType } from '@@/utils/react/props/propTypes.ts'



export const blockSizes = (() => {
  
  const block = (() => {
    const bdSz = 2
    const imSz = 37
    const sz = bdSz + imSz + bdSz
    
    const szOfFsz = (size: number) => szOf(size, sz)
    const szInCqw = (size: number) => fracToCqw(szOfFsz(size))
    const szInPerc = (size: number) => fracToPerc(szOfFsz(size))
    
    const imPerc = szInPerc(imSz)
    
    return {
      bdSz, imSz, sz,
      szOf, szOfFsz, szInCqw, szInPerc,
      imPerc,
    }
  })()
  
  const blockInFigure = (() => {
    const outsetSz = block.bdSz / 2
    const sz = -outsetSz + block.sz - outsetSz
    const fullSz = block.sz
    
    const szOfFsz = (size: number) => szOf(size, sz)
    const szInCqw = (size: number) => fracToCqw(szOfFsz(size))
    const szInPerc = (size: number) => fracToPerc(szOfFsz(size))
    
    const blockSt = {
      //width: block.szInCqw(fullSz),
      //height: block.szInCqw(fullSz),
      transformOrigin: 'center',
      scale: szOf(fullSz, sz),
    } satisfies StylePropType
    
    return {
      outsetSz, sz,
      szOf, szOfFsz, szInCqw, szInPerc,
      blockSt,
    }
  })()
  
  return { block, blockInFigure }
})()
