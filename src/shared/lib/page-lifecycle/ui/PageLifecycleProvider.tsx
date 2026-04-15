import { PageLifecycleContext } from '@@/lib/page-lifecycle/context/PageLifecycleContext.ts'
import {
  getInitialPageState, getCurrPageState, getCurrPageTransition,
  type PageLifecycleEv,
  type PageState, type PageStateEv, type PageTransition,
} from '@@/lib/page-lifecycle/model/page-lifecycle.ts'
import {
  PageLifecycleStateContext,
} from '@@/lib/page-lifecycle/context/PageLifecycleStateContext.ts'
import { useListeners } from '@@/utils/events/useListeners.ts'
import type { Children } from '@@/utils/react/props/propTypes.ts'
import { useStateAndRef } from '@@/utils/react/state/useStateAndRef.ts'
import { useLayoutEffect } from 'react'



export default function PageLifecycleProvider({ children }: Children) {
  const {
    state: pageState, get: getPageState, set: setPageState,
  } = useStateAndRef<PageState>(getInitialPageState())
  const {
    state: pageTransition, get: getPageTransition, set: setPageTransition,
  } = useStateAndRef<PageTransition | undefined>(undefined)
  //const [getPageEv, setPageEv] = useRefGetSet<PageEv | null>(null)
  
  const listeners = useListeners<PageStateEv>()
  
  useLayoutEffect(() => {
    const onPageEv = (lEv: PageLifecycleEv, ev: Event) => {
      const prevState = getPageState()
      const state = getCurrPageState(prevState, lEv)
      const transition = getCurrPageTransition(prevState, state)
      listeners.notify({ ts: ev.timeStamp, state, transition })
      setPageState(state)
      setPageTransition(transition)
      //setPageEv(lEv)
      
      console.log('pagestatechange', state, transition, 'ts', ev.timeStamp)
    }
    
    const onDocLoad = (ev: Event) => { onPageEv('load', ev) }
    const onDocPageShow = (ev: Event) => { onPageEv('pageshow', ev) }
    const onWindowFocus = (ev: Event) => { onPageEv('windowfocus', ev) }
    const onWindowBlur = (ev: Event) => { onPageEv('windowblur', ev) }
    //const onDocFocusIn = (ev: Event) => { onPageEv('focusin', ev) }
    //const onDocFocusOut = (ev: Event) => { onPageEv('focusout', ev) }
    const onDocPageHide = (ev: Event) => { onPageEv('pagehide', ev) }
    const onDocVisibilityChange = (ev: Event) => { onPageEv('visibilitychange', ev) }
    const onDocFreeze = (ev: Event) => { onPageEv('freeze', ev) }
    const onDocResume = (ev: Event) => { onPageEv('resume', ev) }
    
    document.addEventListener('load', onDocLoad)
    document.addEventListener('pageshow', onDocPageShow)
    // лучше на этих эвентах делать фокус / расфокус  Active / Passive
    window.addEventListener('focus', onWindowFocus)
    window.addEventListener('blur', onWindowBlur)
    //document.addEventListener('focusin', onDocFocusIn)
    //document.addEventListener('focusout', onDocFocusOut)
    document.addEventListener('pagehide', onDocPageHide)
    document.addEventListener('visibilitychange', onDocVisibilityChange)
    document.addEventListener('freeze', onDocFreeze)
    document.addEventListener('resume', onDocResume)
    return () => {
      document.removeEventListener('load', onDocLoad)
      document.removeEventListener('pageshow', onDocPageShow)
      window.removeEventListener('focus', onWindowFocus)
      window.removeEventListener('blur', onWindowBlur)
      //document.removeEventListener('focusin', onDocFocusIn)
      //document.removeEventListener('focusout', onDocFocusOut)
      document.removeEventListener('pagehide', onDocPageHide)
      document.removeEventListener('visibilitychange', onDocVisibilityChange)
      document.removeEventListener('freeze', onDocFreeze)
      document.removeEventListener('resume', onDocResume)
    }
  }, [])
  
  return (
    <PageLifecycleContext value={{ on: listeners.add, off: listeners.remove }}>
      <PageLifecycleStateContext value={{ pageState, pageTransition }}>
        {children}
      </PageLifecycleStateContext>
    </PageLifecycleContext>
  )
}
