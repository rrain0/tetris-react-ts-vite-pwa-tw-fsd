


export function blockSizes() {
  const bdSz = 2
  const imSz = 37
  
  const sz = bdSz + imSz + bdSz
  const outsetSz = bdSz / 2
  const innerSz = sz - outsetSz * 2
  
  const baseSizes = {
    bdSz, imSz,
    innerSz, outsetSz, sz,
  }
  
  const szOf = (size: number, of: number) => size / of
  
  
  const block = (() => {
    const szOfSz = (size: number) => szOf(size, sz)
    const szOfCqw = (size: number) => `${szOfSz(size) * 100}cqw`
    
    const imSt = { borderWidth: szOfCqw(bdSz) }
    
    return {
      ...baseSizes,
      szOf, szOfSz, szOfCqw,
      imSt,
    }
  })()
  
  const blockInFigure = (() => {
    const szOfSz = (size: number) => szOf(size, innerSz)
    const szOfCqw = (size: number) => `${szOfSz(size) * 100}cqw`
    
    const boxSt = {
      width: szOfCqw(sz),
      height: szOfCqw(sz),
      margin: szOfCqw(-outsetSz),
    }
    
    return {
      ...baseSizes,
      szOf, szOfSz, szOfCqw,
      boxSt,
    }
  })()
  
  return { block, blockInFigure }
}
