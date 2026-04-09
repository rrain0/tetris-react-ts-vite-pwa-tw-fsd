


export type HSElem = HTMLElement | SVGElement



// Атрибут, который либо просто есть без значения, либо его нет (<div attr/> или <div/>)
export type HtmlEmptyAttr = '' | undefined
export const toEmptyAttr = (value: any): HtmlEmptyAttr => value ? '' : undefined
export type HtmlDataAttrs = { [Prop in `data-${string}`]?: string | undefined }
