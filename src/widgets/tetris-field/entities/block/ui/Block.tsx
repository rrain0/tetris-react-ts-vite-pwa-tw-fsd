import { blockSizes } from '@/widgets/tetris-field/entities/block/ui/blockSizes.ts'
import type { Div } from '@@/utils/react/props/propTypes.ts'
import * as React from 'react'
import { mapBlockUiTypeToSrc } from '@/widgets/tetris-field/entities/block/lib/blockUi.ts'
import type {
  BlockUiData,
} from '@/widgets/tetris-field/entities/block/model/blockUi.ts'



export type BlockProps = Div & BlockUiData

export default function Block(props: BlockProps) {
  const { type, translucent, pixeled, ...rest } = props
  
  const src = mapBlockUiTypeToSrc(type)
  
  const { imPerc, bd2Cqw } = blockSizes.block
  
  /* TODO colors */
  const bdCl = '#212121'
  
  return (
    <div
      cn={`
        sz-full container-size
        grid stack center2
        ${pixeled || translucent ? 'pixeled-filter' : ''}
      `}
      st={{
        ...translucent && { opacity: 0.6 },
      }}
      {...rest}
    >
      <div cn='sz-full' st={{ borderWidth: bd2Cqw, borderColor: bdCl }}/>
      <img
        st={{ width: imPerc }}
        cn='w-full h-auto square object-center object-cover'
        src={src}
      />
    </div>
  )
}
