


export type HSElem = HTMLElement | SVGElement

export function isWindow<W extends Window, T>(view: T | W): view is W {
  return view instanceof Window
}
export function isHTMLElement<H extends HTMLElement, T>(view: T | H): view is H {
  return view instanceof HTMLElement
}
export function isSVGElement<S extends SVGElement, T>(view: T | S): view is S {
  return view instanceof SVGElement
}


// Атрибут, который либо просто есть без значения, либо его нет (<div attr/> или <div/>)
export type HtmlEmptyAttr = '' | undefined
export const toEmptyAttr = (value: any): HtmlEmptyAttr => value ? '' : undefined
export type HtmlDataAttrs = { [Prop in `data-${string}`]?: string | undefined }



export type Wh = { w: number, h: number }
export type WhOpt = { w?: number | undefined, h?: number | undefined }
