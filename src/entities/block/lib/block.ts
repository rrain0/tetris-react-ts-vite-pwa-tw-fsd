import blueBlock from '@assets/im/blocks/block-blue-39x39.png'
import greenBlock from '@assets/im/blocks/block-green-39x39.png'
import lightBlueBlock from '@assets/im/blocks/block-light-blue-39x39.png'
import orangeBlock from '@assets/im/blocks/block-orange-39x39.png'
import redBlock from '@assets/im/blocks/block-red-39x39.png'
import violetBlock from '@assets/im/blocks/block-violet-39x39.png'
import yellowBlock from '@assets/im/blocks/block-yellow-39x39.png'
import type { BlockType } from '@entities/block/model/block.ts'



const blockTypeToSrc: Record<BlockType, string> = {
  blue: blueBlock,
  green: greenBlock,
  lightBlue: lightBlueBlock,
  orange: orangeBlock,
  red: redBlock,
  violet: violetBlock,
  yellow: yellowBlock,
}

export function mapBlockTypeToSrc(type: BlockType): string {
  return blockTypeToSrc[type]
}
