import {
  type FlexViewShortStyle, processFlexViewShortStyle,
} from 'src/utils/libs/short-style/view-processors/processFlexViewShortStyle.ts'



export function flexStyle<S extends object>(style: S & FlexViewShortStyle) {
  const { flexCss, flexRest } = processFlexViewShortStyle(style)
  return { ...flexCss, ...flexRest }
}
