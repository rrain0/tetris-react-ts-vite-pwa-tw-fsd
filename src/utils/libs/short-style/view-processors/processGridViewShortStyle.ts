import {
  type GridShortStyle,
  processGridShortStyle,
} from 'src/utils/libs/short-style/processors/processGridShortStyle.ts'
import {
  type BoxViewShortStyle, processBoxViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processBoxViewShortStyle.ts'



export type GridViewShortStyle =
  & BoxViewShortStyle
  & GridShortStyle

export function processGridViewShortStyle<P extends object>(props: P & GridViewShortStyle) {
  const { boxCss, boxRest } = processBoxViewShortStyle(props)
  const { gridCss, gridRest } = processGridShortStyle(boxRest)
  
  return {
    gridCss: { ...boxCss, display: 'grid', ...gridCss },
    gridRest,
  }
}

