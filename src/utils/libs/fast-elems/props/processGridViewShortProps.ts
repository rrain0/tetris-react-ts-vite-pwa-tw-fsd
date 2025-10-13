import {
  type GridShortProps,
  processGridShortProps,
} from 'src/utils/libs/fast-elems/base/processGridShortProps.ts'
import {
  type CommonViewShortProps,
  processCommonViewShortProps,
} from 'src/utils/libs/fast-elems/props/processCommonViewShortProps.ts'



export type GridViewShortProps =
  & CommonViewShortProps
  & GridShortProps

export const processGridViewShortProps = <P extends object>(
  props: P & GridViewShortProps
) => {
  const { css, commonViewRest } = processCommonViewShortProps(props)
  const { grid, gridRest } = processGridShortProps(commonViewRest)
  
  return { css: [...css, grid], gridViewRest: gridRest }
}



