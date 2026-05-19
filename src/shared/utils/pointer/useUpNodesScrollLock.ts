import type { Opt } from '@@/utils/ts/ts.ts'
import { type RefObject, useInsertionEffect, useLayoutEffect } from 'react'
import * as uuid from 'uuid'



export const useUpNodesScrollLock = (
  lock: boolean = false,
  options: Opt<{
    element: Element,
    elementRef: RefObject<Element | null>,
  }> = { },
) => {
  const id = uuid.v4()
  const noScrollXClass = `no-scroll-x-${id}`
  const noScrollYClass = `no-scroll-y-${id}`
  
  useInsertionEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .${noScrollXClass} { overflow-x: hidden; }
      .${noScrollYClass} { overflow-y: hidden; }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])
  
  useLayoutEffect(() => {
    const el = (() => {
      if (options.element) return options.element
      if (options.elementRef) return options.elementRef.current
      return undefined
    })()
    if (lock) {
      // Setting overflow on body passes directly to WINDOW
      const x: Element[] = [document.body]
      const y: Element[] = [document.body]
      if (el) {
        let up = el.parentElement
        while (up) {
          const getComputedStyle = (() => {
            if (up.computedStyleMap as unknown) {
              return (prop: string) => up!.computedStyleMap().get(prop)
            }
            return (prop: string) => window.getComputedStyle(up!)[prop as any]
          })()
          if (['auto', 'scroll'].includes(getComputedStyle('overflow-x') as any)) {
            x.push(up)
          }
          if (['auto', 'scroll'].includes(getComputedStyle('overflow-y') as any)) {
            y.push(up)
          }
          up = up.parentElement
        }
      }
      
      x.forEach(el => el.classList.add(noScrollXClass))
      y.forEach(el => el.classList.add(noScrollYClass))
      
      return () => {
        x.forEach(el => el.classList.remove(noScrollXClass))
        y.forEach(el => el.classList.remove(noScrollYClass))
      }
    }
  }, [lock, options.element, options.elementRef?.current])
}
