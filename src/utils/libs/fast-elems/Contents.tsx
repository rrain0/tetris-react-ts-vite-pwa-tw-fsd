import React from 'react'
import {
  type BoxViewShortStyle, processBoxViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processBoxViewShortStyle.ts'



export type ContentsProps = React.ComponentProps<'div'> & BoxViewShortStyle

function Contents(props: ContentsProps) {
  
  const { boxCss, boxRest } = processBoxViewShortStyle(props)
  const { children, ...restProps } = boxRest
  
  return (
    <div
      data-display-name='Contents'
      {...restProps}
      css={{ display: 'contents', ...boxCss }}
    >
      {children}
    </div>
  )
}
export default Contents
