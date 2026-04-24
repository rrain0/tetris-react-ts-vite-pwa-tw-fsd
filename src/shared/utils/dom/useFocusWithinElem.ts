import type { HSElem } from '@@/utils/dom/elem.ts'
import { useRefGetOnSet } from '@@/utils/react/state/useRefGetOnSet.ts'
import { type RefCallback, useEffectEvent, useLayoutEffect } from 'react'



export function useFocusWithinElem(enable = true): RefCallback<HSElem> {
  const [get, set] = useRefGetOnSet<HSElem | null>(null, elem => {
    // Apply focus on element change
    if (enable && elem) makeFocusWithinElem(elem)
  })
  
  // Apply focus on any blur event
  const tryFocus = useEffectEvent(() => {
    const elem = get()
    if (enable && elem) makeFocusWithinElem(elem)
  })
  useLayoutEffect(() => {
    const onFocusOut = () => { tryFocus() }
    window.addEventListener('focusout', onFocusOut)
    return () => window.removeEventListener('focusout', onFocusOut)
  }, [])
  
  return set
}



export function makeFocusWithinElem(element: HSElem) {
  const windowFocused = document.hasFocus()
  if (!windowFocused) return
  const desiredElemContainsFocus = element.contains(document.activeElement)
  if (desiredElemContainsFocus) return
  element.focus({ preventScroll: true })
}
