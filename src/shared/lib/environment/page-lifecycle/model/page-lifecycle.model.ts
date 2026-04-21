import { assertNever, type EvCb } from '@@/utils/ts/ts.ts'



export type PageState =
  | 'Active' // page visible + has viewport focus
  | 'Passive' // page visible
  | 'Hidden' // page not visible
  | 'Frozen' // page not visible + has frozen
  | 'Discarded' // page is unloaded to conserve resources
  | 'Terminated' // page has started being unloaded & cleared from memory

export type PageTransition =
  | 'Restored' // page becomes visible
  | 'Minimized' // page becomes invisible

export type PageNativeLifecycleEv =
  | 'load'
  | 'pageshow'
  | 'windowfocus'
  | 'windowblur'
  | 'visibilitychange'
  | 'resume'
  | 'freeze'
  | 'pagehide'

export type PageLifecycleEv = {
  ts: number
  state: PageState
  transition: PageTransition | undefined
}

export type OnPageLifecycle = EvCb<PageLifecycleEv>



export function getInitialPageState(): PageState {
  if (document.hasFocus()) return 'Active'
  else if (document.visibilityState === 'visible') return 'Passive'
  else if (document.visibilityState === 'hidden') return 'Hidden'
  assertNever(document.visibilityState)
}


function getActiveOrPassiveOrHidden(): PageState {
  if (document.visibilityState === 'hidden') return 'Hidden'
  if (document.hasFocus()) return 'Active'
  return 'Passive'
}

export function getCurrPageState(prevState: PageState, lEv: PageNativeLifecycleEv): PageState {
  if (lEv === 'load') {
    if ((document as any).wasDiscarded) return 'Discarded'
    return prevState
  }
  else if (lEv === 'pageshow') return getActiveOrPassiveOrHidden()
  else if (lEv === 'windowfocus') return getActiveOrPassiveOrHidden()
  else if (lEv === 'windowblur') return getActiveOrPassiveOrHidden()
  else if (lEv === 'visibilitychange') return getActiveOrPassiveOrHidden()
  else if (lEv === 'pagehide') return prevState
  else if (lEv === 'freeze') return 'Hidden'
  else if (lEv === 'resume') {
    if (document.visibilityState === 'hidden') return 'Hidden'
    return prevState
  }
  
  const fallbackState = getActiveOrPassiveOrHidden()
  console.warn(
    `Undefined page state from ` +
    `prev state: ${prevState} and curr event: ${lEv}, `+
    `using fallback state: ${fallbackState}`
  )
  return fallbackState
}

export function getCurrPageTransition(
  prevState: PageState,
  state: PageState,
): PageTransition | undefined {
  const p = prevState, s = state
  const prevVisible = p === 'Active' || p === 'Passive'
  const visible = s === 'Active' || s === 'Passive'
  if (!prevVisible && visible) return 'Restored'
  if (prevVisible && !visible) return 'Minimized'
  return undefined
}