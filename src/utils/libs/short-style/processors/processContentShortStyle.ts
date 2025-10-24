import { isdef, type Pu } from 'src/utils/base/tsUtils.ts'




export type ContentShortStyle = Pu<{
  bg: string // { background }
  bgColor: string // { backgroundColor }
  color: string // { color }
  
  noOverflow: boolean // true => { overflow: 'hidden' }
  overflowAuto: boolean // true => { overflow: 'auto' }
  overflowHidden: boolean // true => { overflow: 'hidden' }
  overflowVisible: boolean // true => { overflow: 'visible' }
}>



export const processContentShortStyle = <P extends object>(
  props: P & ContentShortStyle
) => {
  const {
    bg, bgColor, color,
    noOverflow, overflowAuto, overflowHidden, overflowVisible,
    ...contentRest
  } = props
  
  
  
  const contentCss = {
    ...isdef(bg) && { background: bg },
    ...isdef(bgColor) && { backgroundColor: bgColor },
    ...isdef(color) && { color: color },
    
    ...noOverflow && { overflow: 'hidden' },
    ...overflowAuto && { overflow: 'auto' },
    ...overflowHidden && { overflow: 'hidden' },
    ...overflowVisible && { overflow: 'visible' },
  }
  
  return { contentCss, contentRest }
}



