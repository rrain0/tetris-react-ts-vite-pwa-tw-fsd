import React from 'react'
import {
  type FlexViewShortStyle, processFlexViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processFlexViewShortStyle.ts'



export type FlexProps = React.ComponentProps<'div'> & FlexViewShortStyle

function Flex(props: FlexProps) {
  
  const { flexCss, flexRest } = processFlexViewShortStyle(props)
  const { children, ...restProps } = flexRest
  
  return (
    <div
      data-display-name='Flex'
      {...restProps}
      // @ts-ignore
      css={{ display: 'flex', ...flexCss }}
    >
      {children}
    </div>
  )
}
export default Flex
