import React from 'react'
import {
  type GridViewShortStyle, processGridViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processGridViewShortStyle.ts'



export type GridProps = React.ComponentProps<'div'> & GridViewShortStyle

function Grid(props: GridProps) {
  
  const { gridCss, gridRest } = processGridViewShortStyle(props)
  const { children, ...restProps } = gridRest
  
  return (
    <div
      data-display-name='Grid'
      {...restProps}
      // @ts-ignore
      css={{ display: 'grid', ...gridCss }}
    >
      {children}
    </div>
  )
}
export default Grid
