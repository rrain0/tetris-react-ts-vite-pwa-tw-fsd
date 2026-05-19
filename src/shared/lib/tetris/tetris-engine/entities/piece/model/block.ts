import type { Xy } from '@@/utils/math/rect.ts'



export type Block<T = any> = Xy & { value: T }
// Rectangular matrix →x ↓y
export type Blocks<T = any> = T[][]



export function blocksRows(blocks: Blocks) { return blocks.length }
export function blocksCols(blocks: Blocks) { return blocks[0]?.length ?? 0 }

export function *blocksIterator<T>(blocks: Blocks<T>): IterableIterator<Block<T>> {
  const rows = blocksRows(blocks), cols = blocksCols(blocks)
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const block = { x, y, value: blocks[y][x] }
    yield block
  }
}

export function blocksGetBounds(blocks: Blocks) {
  const rows = blocksRows(blocks), cols = blocksCols(blocks)
  let xFirst = cols - 1, yFirst = rows - 1, xLast = 0, yLast = 0, anyBlock = false
  for (const block of blocksIterator(blocks)) {
    const { x, y, value } = block
    if (value) {
      xFirst = Math.min(xFirst, x)
      yFirst = Math.min(yFirst, y)
      xLast = Math.max(xLast, x)
      yLast = Math.max(yLast, y)
      anyBlock = true
    }
  }
  if (anyBlock) return { xFirst, yFirst, xLast, yLast }
  return null
}
