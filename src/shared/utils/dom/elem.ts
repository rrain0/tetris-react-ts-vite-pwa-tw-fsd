


export type HSElem = HTMLElement | SVGElement

export function isWindow<W extends Window, T>(view: T | W): view is W {
  return view instanceof Window
}
export function isElement<E extends Element, T>(view: T | E): view is E {
  return view instanceof Element
}
export function isHTMLElement<H extends HTMLElement, T>(view: T | H): view is H {
  return view instanceof HTMLElement
}
export function isSVGElement<S extends SVGElement, T>(view: T | S): view is S {
  return view instanceof SVGElement
}

export const getWindowHtml = (window: Window) => window.document
export const getDocHtml = (doc: Document) => doc.documentElement
export const getElemHtml = (elem: HSElem) => elem.ownerDocument.documentElement


// Атрибут, который либо просто есть без значения, либо его нет (<div attr/> или <div/>)
export type HtmlEmptyAttr = '' | undefined
export const toEmptyAttr = (value: any): HtmlEmptyAttr => value ? '' : undefined
export type HtmlDataAttrs = { [Prop in `data-${string}`]?: string | undefined }
