import React from 'react'
import {
  type BoxViewShortStyle, processBoxViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processBoxViewShortStyle.ts'



export type GapProps = React.ComponentProps<'div'> & BoxViewShortStyle

function Gap(props: GapProps) {
  
  const { boxCss, boxRest } = processBoxViewShortStyle(props)
  const { children, ...restProps } = boxRest
  
  return (
    <div
      data-display-name='Gap'
      {...restProps}
      css={boxCss}
    >
      {children}
    </div>
  )
}
export default Gap
