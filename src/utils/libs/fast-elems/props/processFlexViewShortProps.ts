import {
  type FlexShortProps,
  processFlexShortProps,
} from 'src/utils/libs/fast-elems/base/processFlexShortProps.ts'
import {
  type CommonViewShortProps,
  processCommonViewShortProps,
} from 'src/utils/libs/fast-elems/props/processCommonViewShortProps.ts'



export type FlexViewShortProps =
  & CommonViewShortProps
  & FlexShortProps

export const processFlexViewShortProps = <P extends object>(
  props: P & FlexViewShortProps
) => {
  const { css, commonViewRest } = processCommonViewShortProps(props)
  const { flex, flexRest } = processFlexShortProps(commonViewRest)
  
  return { css: [...css, flex], flexViewRest: flexRest }
}



