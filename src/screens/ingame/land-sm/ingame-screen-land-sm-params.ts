


export const ingameScreenLandSmParams = (nextFieldCols = 4) => {
  const blockSz = 1.0
  
  const fieldBdW = 0.16
  const fieldW = fieldBdW + 10 * blockSz + fieldBdW
  const fieldH = fieldBdW + 20 * blockSz + fieldBdW
  
  const sideW = 6 * blockSz
  const sideG = 0.35
  const nextW = nextFieldCols * blockSz
  const titleH = 0.8
  const digitH = 0.9
  
  const icSz = 1
  const icsG = 0.3
  const icsW = icSz + icsG + icSz
  
  const gameG = 0.5
  const gameW = fieldW + gameG + sideW + gameG + icsW
  const gameH = fieldH
  const gameRatio = gameW / gameH
  
  const w = (w: number) => `${w / gameW * 100 * gameRatio}cqh`
  
  return {
    blockSz,
    fieldBdW, fieldW, fieldH,
    sideW, sideG, nextW, titleH, digitH,
    icSz, icsG, icsW,
    gameG, gameW, gameH, gameRatio,
    w,
  }
}
