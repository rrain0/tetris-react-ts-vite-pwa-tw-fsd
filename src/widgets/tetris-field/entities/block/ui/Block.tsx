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
  
  const { bdSz, sz, imPerc, bd2Cqw } = blockSizes.block
  
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
      {/* If i make div with border - it drops fps dramatically */}
      <svg cn='sz-full' viewBox={`0 0 ${sz} ${sz}`}>
        <rect x={bdSz / 2} y={bdSz / 2} width={sz - bdSz} height={sz - bdSz}
          stroke={bdCl} strokeWidth={bdSz} fill='transparent'
        />
      </svg>
      <img
        st={{ width: imPerc }}
        cn='w-full h-auto square object-center object-cover'
        src={src}
      />
    </div>
  )
}
