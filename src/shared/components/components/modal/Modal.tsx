import { useUpNodesScrollLock } from '@@/utils/pointer/useUpNodesScrollLock.ts'
import { combineProps } from '@@/utils/react/props/combineProps.ts'
import { combineRefs } from '@@/utils/react/props/combineRefs.ts'
import type { Opt } from '@@/utils/ts/ts.ts'
//import { useClick } from '@utils/app/gestures/useClick.ts'
import React, { type ComponentProps, useRef } from 'react'
import ModalPortal from './ModalPortal.tsx'




export type ModalProps = ComponentProps<'article'> & Opt<{
  noPortal: boolean
  //disableOnThisClick: boolean
  onlyFrame: boolean
  disableUpNodesScroll: boolean
  noDim: boolean
  noPointer: boolean
}>


export default function Modal(props: ModalProps) {
  const {
    noPortal,
    //disableOnThisClick,
    onlyFrame,
    disableUpNodesScroll = onlyFrame,
    noDim = onlyFrame,
    noPointer = onlyFrame,
    //onClick,
    children,
    ref,
    ...restProps
  } = props
  
  const elemRef = useRef<HTMLDivElement>(null)
  
  //const getOnClick = useClick({ onlyThisElemClick: !disableOnThisClick })
  
  useUpNodesScrollLock(!disableUpNodesScroll, { elementRef: elemRef })
  
  const Portal = noPortal ? React.Fragment : ModalPortal
  return (
    <Portal>
      <div
        cn={`
          fixed-bot h-[100dvh] z-[1000] bg-cl-[#0000009a]
          ${noPointer ? 'no-pointer' : ''}
        `}
        ref={combineRefs(ref, elemRef)}
        data-display-name='Modal'
        st={{
          ...noDim && { backgroundColor: 'transparent' },
        }}
        {...combineProps(
          restProps,
          //getOnClick(onClick),
        )}
      >
        {children}
      </div>
    </Portal>
  )
}
