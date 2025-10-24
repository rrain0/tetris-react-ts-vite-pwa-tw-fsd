import { isdef, type Pu } from 'src/utils/base/tsUtils.ts'




export type SizeShortStyle = Pu<{
  boxSizing: string // { boxSizing }
  contentBox: boolean // true => { boxSizing: 'content-box' }
  borderBox: boolean // true => { boxSizing: 'border-box' }
  
  // 'full' => '100%'
  // 'ct' => 'fit-content'
  w: number | string | 'full' | 'ct' // { width }
  h: number | string | 'full' | 'ct' // { height }
  sz: number | string | 'full' | 'ct' // { width, height }
  size: number | string | 'full' | 'ct' // { width, height }
  wMin: number | string | 'full' // { minWidth }
  hMin: number | string | 'full' // { minHeight }
  szMin: number | string | 'full' // { minWidth, minHeight }
  sizeMin: number | string | 'full' // { minWidth, minHeight }
  wMax: number | string | 'full' // { maxWidth }
  hMax: number | string | 'full' // { maxHeight }
  szMax: number | string | 'full' // { maxWidth, maxHeight }
  sizeMax: number | string | 'full' // { maxWidth, maxHeight }
  
  fullW: boolean // true => { width: '100%' }
  fullH: boolean // true => { height: '100%' }
  full: boolean // true => { width: '100%', height: '100%' }
  fullWMin: boolean // true => { min-width: '100%' }
  fullHMin: boolean // true => { min-height: '100%' }
  fullWMax: boolean // true => { max-width: '100%' }
  fullHMax: boolean // true => { max-height: '100%' }
  
  wFull: boolean // true => { width: '100%' }
  hFull: boolean // true => { height: '100%' }
  szFull: boolean // true => { width: '100%', height: '100%' }
  sizeFull: boolean // true => { width: '100%', height: '100%' }
  wCt: boolean // true => { width: 'fit-content' }
  hCt: boolean // true => { height: 'fit-content' }
  szCt: boolean // true => { width: 'fit-content', height: 'fit-content' }
  sizeCt: boolean // true => { width: 'fit-content', height: 'fit-content' }
  
  ratio: number | string // => { aspectRatio: ratio }
  rad: number | string // => { borderRadius: rad }
  
  round: boolean // true => { borderRadius: 999999 }
  
  // margins
  m: number | string // { margin }
  mv: number | string // { marginTop, marginBottom }
  mh: number | string // { marginLeft, marginRight }
  mt: number | string // { marginTop }
  mr: number | string // { marginRight }
  mb: number | string // { marginBottom }
  ml: number | string // { marginLeft }
  // paddings
  p: number | string // { padding }
  pv: number | string // { paddingTop, paddingBottom }
  ph: number | string // { paddingLeft, paddingRight }
  pt: number | string // { paddingTop }
  pr: number | string // { paddingRight }
  pb: number | string // { paddingBottom }
  pl: number | string // { paddingLeft }
}>



export const processSizeShortStyle = <P extends object>(
  props: P & SizeShortStyle
) => {
  const {
    boxSizing, contentBox, borderBox,
    
    w, h, sz, size = sz,
    wMin, hMin, sizeMin, szMin = sizeMin,
    wMax, hMax, sizeMax, szMax = sizeMax,
    
    fullW, fullH, full,
    fullWMin, fullHMin,
    fullWMax, fullHMax,
    
    wFull = fullW, hFull = fullH, sizeFull = full, szFull = sizeFull,
    wCt, hCt, szCt, sizeCt = szCt,
    
    ratio, rad, round,
    m, mv, mh, mt, mr, mb, ml,
    p, pv, ph, pt, pr, pb, pl,
    ...sizeRest
  } = props
  
  
  
  
  
  const sizeCss = {
    ...contentBox && { boxSizing: 'content-box' },
    ...borderBox && { boxSizing: 'border-box' },
    ...isdef(boxSizing) && { boxSizing: boxSizing },
    
    ...szFull && { width: '100%', height: '100%' },
    
    ...szCt && { width: 'fit-content', height: 'fit-content' },
    
    ...isdef(sz) && { width: processAnySz(sz), height: processAnySz(sz) },
    ...isdef(szMin) && { minWidth: processAnySz(szMin), minHeight: processAnySz(szMin) },
    ...isdef(szMax) && { maxWidth: processAnySz(szMax), maxHeight: processAnySz(szMax) },
    
    ...wFull && { width: '100%' },
    ...hFull && { height: '100%' },
    ...fullWMin && { minWidth: '100%' },
    ...fullHMin && { minHeight: '100%' },
    ...fullWMax && { maxWidth: '100%' },
    ...fullHMax && { maxHeight: '100%' },
    
    ...wCt && { width: 'fit-content' },
    ...hCt && { height: 'fit-content' },
    
    ...isdef(w) && { width: processAnySz(w) },
    ...isdef(h) && { height: processAnySz(h) },
    ...isdef(wMin) && { minWidth: processAnySz(wMin) },
    ...isdef(hMin) && { minHeight: processAnySz(hMin) },
    ...isdef(wMax) && { maxWidth: processAnySz(wMax) },
    ...isdef(hMax) && { maxHeight: processAnySz(hMax) },
    
    ...round && { borderRadius: 999999 },
    
    ...isdef(ratio) && { aspectRatio: ratio },
    ...isdef(rad) && { borderRadius: rad },
    
    ...isdef(m) && { margin: m },
    ...isdef(mv) && { marginTop: mv, marginBottom: mv },
    ...isdef(mh) && { marginLeft: mh, marginRight: mh },
    ...isdef(mt) && { marginTop: mt },
    ...isdef(mr) && { marginRight: mr },
    ...isdef(mb) && { marginBottom: mb },
    ...isdef(ml) && { marginLeft: ml },
    
    ...isdef(p) && { padding: p },
    ...isdef(pv) && { paddingTop: pv, paddingBottom: pv },
    ...isdef(ph) && { paddingLeft: ph, paddingRight: ph },
    ...isdef(pt) && { paddingTop: pt },
    ...isdef(pr) && { paddingRight: pr },
    ...isdef(pb) && { paddingBottom: pb },
    ...isdef(pl) && { paddingLeft: pl },
  }
  
  return { sizeCss, sizeRest }
}



const processAnySz = (sz?: number | string | 'full' | 'ct') => {
  if (sz === 'full') return '100%'
  if (sz === 'ct') return 'fit-content'
  return sz
}
