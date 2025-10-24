import type { Pu } from 'src/utils/base/tsUtils.ts'




export type PointerShortStyle = Pu<{
  pointerAuto: boolean // true => { pointerEvents: 'auto' }
  noPointer: boolean // true => { pointerEvents: 'none' }
  noTouchAction: boolean // true = > { touchAction: 'none' }
}>



export const processPointerShortStyle = <P extends object>(
  props: P & PointerShortStyle
) => {
  const {
    pointerAuto, noPointer, noTouchAction,
    ...pointerRest
  } = props
  
  
  
  const pointerCss = {
    ...pointerAuto && { pointerEvents: 'auto' },
    ...noPointer && { pointerEvents: 'none' },
    ...noTouchAction && { touchAction: 'none' },
  }
  
  return { pointerCss, pointerRest }
}



