import { type DefinedVal, isbool, isdef, isstring } from 'src/utils/base/tsUtils.ts'
import { boxStyle } from 'src/utils/libs/short-style/view-style/boxStyle.ts'
import { flexStyle } from 'src/utils/libs/short-style/view-style/flexStyle.ts'
import { gridStyle } from 'src/utils/libs/short-style/view-style/gridStyle.ts'
import type {
  BoxViewShortStyle
} from 'src/utils/libs/short-style/view-processors/processBoxViewShortStyle.ts'
import type {
  FlexViewShortStyle
} from 'src/utils/libs/short-style/view-processors/processFlexViewShortStyle.ts'
import type {
  GridViewShortStyle
} from 'src/utils/libs/short-style/view-processors/processGridViewShortStyle.ts'




export interface BoxLayoutViewShortStyle extends BoxViewShortStyle {
  flex?: unknown
  grid?: unknown
}
export interface FlexLayoutViewShortStyle extends FlexViewShortStyle {
  flex: true
  grid?: unknown
}
export interface GridLayoutViewShortStyle extends Omit<GridViewShortStyle, 'grid'> {
  flex?: unknown
  grid: DefinedVal<GridViewShortStyle['grid']> | true
}
export type LayoutViewShortStyle =
  | BoxLayoutViewShortStyle
  | FlexLayoutViewShortStyle
  | GridLayoutViewShortStyle



type BoxStyleReturn<P extends object> = ReturnType<typeof boxStyle<P>>
type FlexStyleReturn<P extends object> = ReturnType<typeof flexStyle<P>>
type GridStyleReturn<P extends object> = ReturnType<typeof gridStyle<P>>



export function layoutStyle<P extends object>(
  props: P & BoxLayoutViewShortStyle
): BoxStyleReturn<P>
export function layoutStyle<P extends object>(
  props: P & FlexLayoutViewShortStyle
): FlexStyleReturn<P>
export function layoutStyle<P extends object>(
  props: P & GridLayoutViewShortStyle
): GridStyleReturn<P>
export function layoutStyle<P extends object>(
  props: P & LayoutViewShortStyle
) {
  const { flex, grid, ...rest } = props
  if (grid === true || isstring(grid)) {
    return gridStyle({ ...rest, flex, ...isstring(grid) && { grid } })
  }
  if (flex === true) {
    return flexStyle(rest)
  }
  return boxStyle(props)
}


/*
const test = layoutStyle({
  flex: true,
  wrap: true,
  place: 'center',
})
const test2 = layoutStyle({
  grid: true,
  wrap: true,
  place: 'center',
})
*/
