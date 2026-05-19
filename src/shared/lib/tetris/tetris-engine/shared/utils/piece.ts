import type { Blocks } from '@@/lib/tetris/tetris-engine/entities/piece/model/block.ts'
import { rectMatrixToRotated } from '@@/lib/tetris/tetris-engine/shared/utils/matrix.ts'
import { mod } from '@@/utils/math/mod.ts'
import type { Xy, XydxdyOpt } from '@@/utils/math/rect.ts'



export function moveXy(x: number, y: number, move: XydxdyOpt): Xy {
  const { x: mx, y: my, dx, dy } = move
  const x1 = (mx ?? x) + (dx ?? 0)
  const y1 = (my ?? y) + (dy ?? 0)
  return { x: x1, y: y1 }
}

export function mathRotate(blocks: Blocks, rotI: number, direction: 1 | -1) {
  blocks = rectMatrixToRotated(blocks, direction)
  rotI = mod(rotI + direction, 4)
  return { blocks, rotI }
}
