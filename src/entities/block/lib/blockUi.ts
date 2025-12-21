import { mapBlockTypeToSrc } from '@entities/block/lib/block.ts'
import type { BlockUiType } from '@entities/block/model/blockUi.ts'



export function mapBlockUiTypeToSrc(type: BlockUiType): string | undefined {
  if (!type) return undefined
  return mapBlockTypeToSrc(type)
}
