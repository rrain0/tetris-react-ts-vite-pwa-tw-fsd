import React from 'react'
import {
  type BoxViewShortStyle, processBoxViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processBoxViewShortStyle.ts'



export type DivProps = React.ComponentProps<'div'> & BoxViewShortStyle

function Div(props: DivProps) {
  
  const { boxCss, boxRest } = processBoxViewShortStyle(props)
  const { children, ...restProps } = boxRest
  
  return (
    <div
      data-display-name='Div'
      {...restProps}
      css={boxCss}
    >
      {children}
    </div>
  )
}
export default Div
