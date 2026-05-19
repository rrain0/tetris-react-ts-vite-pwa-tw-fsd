import { array } from '@@/utils/array/arrCreate.ts'



export function matrixCopy<T extends any[][]>(matrix: T): T {
  return matrix.map(it => [...it]) as T
}

// direction: 1 - clockwise, 2 - twice-clockwise, -1 - counterclockwise
export function rectMatrixToRotated<T>(matrix: T[][], direction: number): T[][] {
  const m = matrix
  if (direction === 1) {
    const ryLen = m[0].length
    const rxLen = m.length
    const rotated = array(ryLen).map(() => array(rxLen)) as T[][]
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        rotated[x][rxLen - 1 - y] = m[y][x]
      }
    }
    return rotated
  }
  if (direction === 2) {
    const ryLen = m.length
    const rxLen = m[0].length
    const rotated = array(ryLen).map(() => array(rxLen)) as T[][]
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        rotated[ryLen - 1 - y][rxLen - 1 - x] = m[y][x]
      }
    }
    return rotated
  }
  if (direction === -1) {
    const ryLen = m[0].length
    const rxLen = m.length
    const rotated = array(ryLen).map(() => array(rxLen)) as T[][]
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        rotated[ryLen - 1 - x][y] = m[y][x]
      }
    }
    return rotated
  }
  return matrixCopy(m)
}
