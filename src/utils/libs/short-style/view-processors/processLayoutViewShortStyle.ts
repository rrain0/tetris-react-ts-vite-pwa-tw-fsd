import { isbool, isdef, isstring } from 'src/utils/base/tsUtils.ts'
import {
  processBoxViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processBoxViewShortStyle.ts'
import {
  processFlexViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processFlexViewShortStyle.ts'
import {
  processGridViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processGridViewShortStyle.ts'
import type {
  BoxLayoutViewShortStyle,
  FlexLayoutViewShortStyle, GridLayoutViewShortStyle,
  LayoutViewShortStyle,
} from 'src/utils/libs/short-style/view-style/layoutStyle.ts'



type BoxReturn<P extends object> = ReturnType<typeof processBoxViewShortStyle<P>>
type FlexReturn<P extends object> = ReturnType<typeof processFlexViewShortStyle<P>>
type GridReturn<P extends object> = ReturnType<typeof processGridViewShortStyle<P>>



export function processLayoutViewShortStyle<P extends object>(
  props: P & BoxLayoutViewShortStyle
): { layoutCss: BoxReturn<P>['boxCss'], layoutRest: BoxReturn<P>['boxRest'] }
export function processLayoutViewShortStyle<P extends object>(
  props: P & FlexLayoutViewShortStyle
): { layoutCss: FlexReturn<P>['flexCss'], layoutRest: FlexReturn<P>['flexRest'] }
export function processLayoutViewShortStyle<P extends object>(
  props: P & GridLayoutViewShortStyle
): { layoutCss: GridReturn<P>['gridCss'], layoutRest: GridReturn<P>['gridRest'] }
export function processLayoutViewShortStyle<P extends object>(
  props: P & LayoutViewShortStyle
) {
  const { flex, grid, ...rest } = props
  
  if (grid === true || isstring(grid)) {
    const { gridCss, gridRest } = processGridViewShortStyle({
      ...rest, ...isstring(grid) && { grid },
    })
    return { layoutCss: gridCss, layoutRest: gridRest }
  }
  
  if (flex === true) {
    const { flexCss, flexRest } = processFlexViewShortStyle(rest)
    return { layoutCss: flexCss, layoutRest: flexRest }
  }
  
  const { boxCss, boxRest } = processBoxViewShortStyle(props)
  return { layoutCss: boxCss, layoutRest: boxRest }
}



{
  function fun(p: LayoutViewShortStyle) {
    const as = processLayoutViewShortStyle(p)
  }
}

{
  const p: LayoutViewShortStyle = { }
  const ps = processLayoutViewShortStyle(p)
}
{
  const p = { } satisfies LayoutViewShortStyle
  const ps = processLayoutViewShortStyle(p)
}

const test = processLayoutViewShortStyle({
  flex: true,
  wrap: true,
  place: 'center',
})
const test2 = processLayoutViewShortStyle({
  grid: true,
  wrap: true,
  place: 'center',
})
