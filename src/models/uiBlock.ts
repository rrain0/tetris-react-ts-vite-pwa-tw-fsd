import blueBlock from '@assets/im/blocks/block-blue-39x39.png'
import greenBlock from '@assets/im/blocks/block-green-39x39.png'
import lightBlueBlock from '@assets/im/blocks/block-light-blue-39x39.png'
import orangeBlock from '@assets/im/blocks/block-orange-39x39.png'
import redBlock from '@assets/im/blocks/block-red-39x39.png'
import violetBlock from '@assets/im/blocks/block-violet-39x39.png'
import yellowBlock from '@assets/im/blocks/block-yellow-39x39.png'




export type UiBlockType =
  | 'blue'
  | 'green'
  | 'lightBlue'
  | 'orange'
  | 'red'
  | 'violet'
  | 'yellow'

export type UiBlockInGlass = UiBlockType | ''

export function uiBlockTypeToSrc(type: UiBlockInGlass): string | undefined {
  const record: Record<UiBlockType, string> = {
    blue: blueBlock,
    green: greenBlock,
    lightBlue: lightBlueBlock,
    orange: orangeBlock,
    red: redBlock,
    violet: violetBlock,
    yellow: yellowBlock,
  }
  return record[type]
}
