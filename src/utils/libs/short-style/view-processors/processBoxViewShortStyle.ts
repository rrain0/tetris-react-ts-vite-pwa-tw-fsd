import {
  type ContentShortStyle, processContentShortStyle,
} from 'src/utils/libs/short-style/processors/processContentShortStyle.ts'
import {
  type PlacedShortStyle, processPlacedShortStyle,
} from 'src/utils/libs/short-style/processors/processPlacedShortStyle.ts'
import {
  type PointerShortStyle, processPointerShortStyle,
} from 'src/utils/libs/short-style/processors/processPointerShortStyle.ts'
import {
  type PositionShortStyle, processPositionShortStyle,
} from 'src/utils/libs/short-style/processors/processPositionShortStyle.ts'
import {
  processSizeShortStyle,
  type SizeShortStyle,
} from 'src/utils/libs/short-style/processors/processSizeShortStyle.ts'
import {
  processTextShortStyle,
  type TextShortStyle,
} from 'src/utils/libs/short-style/processors/processTextShortStyle.ts'




export type BoxViewShortStyle =
  & PointerShortStyle
  & PositionShortStyle
  & SizeShortStyle
  & PlacedShortStyle
  & ContentShortStyle
  & TextShortStyle

export function processBoxViewShortStyle<P extends object>(props: P & BoxViewShortStyle) {
  const { pointerCss, pointerRest } = processPointerShortStyle(props)
  const { positionCss, positionRest } = processPositionShortStyle(pointerRest)
  const { sizeCss, sizeRest } = processSizeShortStyle(positionRest)
  const { placedCss, placedRest } = processPlacedShortStyle(sizeRest)
  const { contentCss, contentRest } = processContentShortStyle(placedRest)
  const { textCss, textRest } = processTextShortStyle(contentRest)
  
  return {
    boxCss: { ...pointerCss, ...positionCss, ...sizeCss, ...placedCss, ...contentCss, ...textCss },
    boxRest: textRest,
  }
}



