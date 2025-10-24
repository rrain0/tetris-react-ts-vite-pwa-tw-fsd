import { isdef, ifBool, type Pu } from 'src/utils/base/tsUtils.ts'




export type TextShortStyle = Pu<{
  textAlign: string | boolean // { textAlign } // true => { textAlign: 'center' }
  textAlignLeft: boolean // true => { textAlign: 'left' }
  textAlignRight: boolean // true => { textAlign: 'right' }
  textAlignJustify: boolean // true => { textAlign: 'justify' }
  
  fontSz: number | string // { fontSize }
  fontWt: number | string // { fontWeight }
  lineH: number | string // { lineHeight }
  
  txSz: number | string // { fontSize }
  txWt: number | string // { fontWeight }
  txH: number | string // { lineHeight }
  txSpacing: number | string // { letterSpacing }
}>



export const processTextShortStyle = <P extends object>(
  props: P & TextShortStyle
) => {
  const {
    textAlign, textAlignLeft, textAlignRight,  textAlignJustify,
    fontSz, fontWt, lineH,
    txSz = fontSz, txWt = fontWt, txH = lineH, txSpacing,
    ...textRest
  } = props
  
  
  
  const textCss = {
    ...textAlignLeft && { textAlign: 'left' },
    ...textAlignRight && { textAlign: 'right' },
    ...textAlignJustify && { textAlign: 'justify' },
    ...isdef(textAlign) && { textAlign: ifBool(textAlign, 'center') },
    
    ...isdef(txSz) && { fontSize: txSz },
    ...isdef(txWt) && { fontWeight: txWt },
    ...isdef(txH) && { lineHeight: txH },
    ...isdef(txSpacing) && { letterSpacing: txSpacing },
  }
  
  return { textCss, textRest }
}



