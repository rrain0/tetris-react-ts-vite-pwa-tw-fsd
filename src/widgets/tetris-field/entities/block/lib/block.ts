import blueBlock from '@@/assets/im/blocks/block-blue-37x37.png'
import greenBlock from '@@/assets/im/blocks/block-green-37x37.png'
import lightBlueBlock from '@@/assets/im/blocks/block-light-blue-37x37.png'
import orangeBlock from '@@/assets/im/blocks/block-orange-37x37.png'
import redBlock from '@@/assets/im/blocks/block-red-37x37.png'
import violetBlock from '@@/assets/im/blocks/block-violet-37x37.png'
import yellowBlock from '@@/assets/im/blocks/block-yellow-37x37.png'
import type { BlockUiColor } from '@/widgets/tetris-field/entities/block/model/blockUi.ts'



const blockTypeToSrc: Record<BlockUiColor, string> = {
  blue: blueBlock,
  green: greenBlock,
  lightBlue: lightBlueBlock,
  orange: orangeBlock,
  red: redBlock,
  violet: violetBlock,
  yellow: yellowBlock,
}

export function mapBlockTypeToSrc(type: BlockUiColor): string {
  return blockTypeToSrc[type]
}
