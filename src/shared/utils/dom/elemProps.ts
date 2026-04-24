import { type HSElem, isHTMLElement, isWindow } from '@@/utils/dom/elem.ts'



export const elemProps = (view: HSElem | Window) => new ElemProps(view)

export class ElemProps {
  constructor(public view: HSElem | Window) { }
  
  get window(): Window {
    if (isWindow(this.view)) return this.view
    return this.view.ownerDocument.defaultView ?? (() => {
      throw new Error('Element has no window')
    })()
  }
  get doc(): Document {
    if (isWindow(this.view)) return this.view.document
    return this.view.ownerDocument
  }
  get html(): HSElem {
    if (isWindow(this.view)) return this.view.document.documentElement
    return this.view.ownerDocument.documentElement
  }
  
  // computed style values after applying all classes and styles
  get computedStyle(): CSSStyleDeclaration {
    if (isWindow(this.view)) return window.getComputedStyle(this.html)
    return window.getComputedStyle(this.view)
  }
  
  // get css custom property (variable) value
  getCssPropValue(propName: string): string {
    return this.computedStyle.getPropertyValue(propName)
  }
  // set css custom property (variable) value
  // Example: <ViewProps>.setCssProp('--w', `${w}px`)
  setCssProp(propName: string, propValue: string) {
    const v = isWindow(this.view) ? this.html : this.view
    v.style.setProperty(propName, propValue)
  }
  setCssProps(props: Record<string, string>) {
    for (const [prop, value] of Object.entries(props)) this.setCssProp(prop, value)
  }
  
  // get element bounding rect
  get rect(): DOMRect {
    if (isWindow(this.view)) return this.html.getBoundingClientRect()
    return this.view.getBoundingClientRect()
  }
  
  
  
  
  // 'viewport' is the window-frame, showing us a part of the whole page
  // 'page' dimensions - relative page (only for mouse / pointer events)
  // 'client' dimensions - relative viewport - they change if you scroll
  
  // If the page scale is not 100%, the values may have an error.
  
  // Here are distances from inner edge of container border to outer edge of element border.
  // rect.height & rect.width of elem can be negative (because of transforms).
  
  get clientWidth() {
    if (isWindow(this.view)) return window.innerWidth
    return this.rect.width
  }
  get clientHeight() {
    if (isWindow(this.view)) return window.innerHeight
    return this.rect.height
  }
  get clientLeftToLeft() {
    if (isWindow(this.view)) return 0
    return this.rect.left
  }
  get clientTopToTop() {
    if (isWindow(this.view)) return 0
    return this.rect.top
  }
  get clientLeftToRight() {
    if (isWindow(this.view)) return this.width
    return this.rect.right
  }
  get clientTopToBottom() {
    if (isWindow(this.view)) return this.height
    return this.rect.bottom
  }
  
  
  get clientX() { return this.clientLeftToLeft }
  get clientY() { return this.clientTopToTop }
  
  get vpX() { return this.clientLeftToLeft }
  get vpY() { return this.clientTopToTop }
  
  get width() { return Math.abs(this.clientWidth) }
  get height() { return Math.abs(this.clientHeight) }
  
  get w() { return this.width }
  get h() { return this.height }
  get x() { return this.clientLeftToLeft }
  get y() { return this.clientTopToTop }
  get wh() { return { w: this.w, h: this.h } }
  get ratio() { return this.w / this.h }
  get xy() { return { x: this.x, y: this.y } }
  
  
  get clientTopLeftToCenter() {
    return {
      x: (this.clientLeftToLeft + this.clientLeftToRight) / 2,
      y: (this.clientTopToTop + this.clientTopToBottom) / 2,
    }
  }
  
  
  
  
  // Offset dimens are rendered rounded int pixel values.
  // ⚠️ Offset dimens does not count any transforms.
  
  get renderedWidth() {
    if (isWindow(this.view)) return window.innerWidth // int value
    if (isHTMLElement(this.view)) return this.view.offsetWidth // int value
    return this.rect.width // svg has no offsetWidth
  }
  get renderedHeight() {
    if (isWindow(this.view)) return window.innerHeight // int value
    if (isHTMLElement(this.view)) return this.view.offsetHeight // int value
    return this.rect.height // svg has no offsetHeight
  }
  get renderedTop() {
    if (isWindow(this.view)) return 0
    if (isHTMLElement(this.view)) return this.view.offsetTop // int value
    return this.rect.width // svg has no offsetTop
  }
  get renderedLeft() {
    if (isWindow(this.view)) return 0
    if (isHTMLElement(this.view)) return this.view.offsetLeft // int value
    return this.rect.height // svg has no offsetLeft
  }
  
  
  
  
  /* 🔶Scroll🔶 */
  
  // Установка значения scrollTop на 0 или +Infinity
  // прокрутит элемент в самый верх/низ соответственно.
  
  
  // width / height of content's visible part
  // ⚠️ for <img> works as offset width / height
  get contentWidth() {
    if (isWindow(this.view)) return this.view.innerWidth // int value
    return this.view.clientWidth // int value
  }
  get contentHeight() {
    if (isWindow(this.view)) return this.view.innerHeight // int value
    return this.view.clientHeight // int value
  }
  
  
  // Width of left scrolled part (behind inner edge of left border of scroll container)
  // of content (scroll container paddings + full content).
  get scrollLeft() {
    if (isWindow(this.view)) return window.scrollX
    return this.view.scrollLeft
  }
  // Height of top scrolled part (behind inner edge of top border of scroll container)
  // of content (scroll container paddings + full content).
  get scrollTop() {
    if (isWindow(this.view)) return window.scrollY
    return this.view.scrollTop
  }
  
  
  // Includes scroll container paddings + full content
  get scrollWidth() {
    if (isWindow(this.view)) return this.html.scrollWidth
    return this.view.scrollWidth
  }
  // Includes scroll container paddings + full content
  get scrollHeight() {
    if (isWindow(this.view)) return this.html.scrollHeight
    return this.view.scrollHeight
  }
  
  
  get scrollLeftMax(): number {
    return this.scrollWidth - this.contentWidth
  }
  get scrollTopMax(): number {
    return this.scrollHeight - this.contentHeight
  }
  
}



/*
 
 margin
 ------
 border
 ------------
 padding
 ------------------
 content
 ------------------
 padding
 ------------
 border
 ------
 margin
 */

/*
 When scroll is enabled:
 ● Scrollbars are placed between border and padding
 ● Paddings become scrollable with content
 ● In Firefox right padding is omitted
 
 Useful:
 ● element.getBoundingClientRect()
 ● window.getComputedStyle(element)
 ● ширина вертикального скроллбара: let scrollWidth = div.offsetWidth - div.clientWidth;
 
 
 WINDOW / VIEWPORT
 ● Get window (viewport):
 const window = window
 const window = document.defaultView
 const window = element.ownerDocument.defaultView
 
 IFRAME WINDOW / VIEWPORT
 ● Get window (viewport):
 const window = <iframe-element>.contentWindow
 const window = <iframe-element>.contentDocument.defaultView
 
 DOCUMENT
 ● Get document:
 const document = window.document
 const document = document
 const document = element.ownerDocument
 
 IFRAME DOCUMENT
 ● Get document:
 const window = <iframe-element>.contentDocument
 
 HTML Element
 ● Get document element (html):
 const html = window.document.documentElement
 const html = document.documentElement
 const html = element.ownerDocument.documentElement
 const html = document.querySelector('html')
 
 BODY Element
 ● Get document body:
 const body = window.document.body
 const body = document.body
 const html = element.ownerDocument.body
 const body = document.querySelector('body')
 
 ● Check if view is window:
 view instanceof Window
 
 ● Check if view is document:
 view instanceof Document
 
 ● Check if view is element (html, body, div, ...):
 view instanceof Element
 
 
 ● ● ● Новое:
 ● document.documentElement.clientWidth/Height
 возвращает ширину/высоту visible viewport без скроллбаров,
 даже если html элемент физически меньше viewport
 ● window.innerWidth/Height
 возвращает ширину/высоту virtual viewport (со скроллбарами)
 ● У десктопа viewport абсолютное позиционирование
 происходит относительно visible viewport.
 У мобилок - относительно virtual viewport.
 Если прокручиваемую страницу контента слишком сильно сжать,
 например десктопоная вёрстка на мобилке,
 то virtual viewport станет больше visible viewport.
 В резултате элемент с { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }
 на мобилках будет прокручен при скролле, потому что соответствует размерам virtual viewport.
 В этом случае window.innerWidth/Height > document.documentElement.clientWidth/Height.
 Но если с вёрсткой страницы всё нормально, то можно считать visible & virtual vp одним.
 ● Чтобы достать нужные viewport wh, достаточно использовать ResizeObserver на элементе с
 { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' } или
 { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }.
 
 
 Изучить:
 
 https://learn.javascript.ru/cross-window-communication
 iframe.contentWindow - ссылка на объект window внутри <iframe>.
 iframe.contentDocument – ссылка на объект document внутри <iframe>,
 короткая запись для iframe.contentWindow.document.
 
 window.devicePixelRatio
 ResizeObserver Entry.borderBoxSize/contentBoxSize/devicePixelContentBoxSize.
 ResizeObserver always triggers onResize when connected (if not immediately disconnected).
 Everything related to devicePixelRatio is not supported by any Safari (2025).
 */
