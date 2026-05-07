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
  
  const boxP = 2
  const blockSz = 37
  
  
  const boxSz = boxP + blockSz + boxP
  const boxM = -boxP / 2
  
  const sz = boxM + boxP + blockSz + boxP + boxM
  
  const ofCqw = (size: number) => `${size / sz * 100}cqw`
  
  const { imSt } = blockSizes().block
  
  
  return (
    <div cn='sz-full container-size' {...rest}>
      <img
        cn={`sz-[100cqw] object-center object-cover
          bd-cl-[#282828]
          ${pixeled || translucent ? 'pixeled-filter' : ''}
        `}
        st={{
          ...imSt,
          ...translucent && { opacity: 0.6 },
        }}
        src={src}
        draggable={false}
      />
    </div>
  )
  
  
  return (
    <div cn='rel w-full h-auto square container-size' {...rest}>
      <div
        cn={`abs h-auto square
          bg-cl-[#282828]
          ${pixeled || translucent ? 'pixeled-filter' : ''}
        `}
        st={{
          width: ofCqw(boxSz),
          inset: ofCqw(boxM),
          padding: ofCqw(boxP),
          //margin: `${p / sz * 100}cqw`,
          ...translucent && { opacity: 0.6 },
        }}
      >
        <img
          cn={`w-full h-auto square object-center object-cover
            ${pixeled || translucent ? 'pixeled-filter' : ''}
          `}
          st={{
            width: ofCqw(blockSz),
            height: ofCqw(blockSz),
          }}
          src={src}
        />
      </div>
    </div>
  )
  
  return (
    <img
      cn={`w-full h-auto square object-center object-cover
        ${pixeled || translucent ? 'pixeled-filter' : ''}
      `}
      st={{
        ...translucent && { opacity: 0.6 },
      }}
      src={src}
      {...rest}
    />
  )
}
