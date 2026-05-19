import {
  HtmlFullscreenContext,
} from '@@/lib/environment/fullscreen-manager/context/HtmlFullscreenContext.ts'
import {
  PageLifecycleContext,
} from '@@/lib/environment/page-lifecycle/context/PageLifecycleContext.ts'
import type {
  PageLifecycleEv,
} from '@@/lib/environment/page-lifecycle/model/page-lifecycle.model.ts'
import { useIsPwa } from '@@/utils/css/useIsPwa.ts'
import { isElement } from '@@/utils/dom/elem.ts'
import type { Children } from '@@/utils/react/props/propTypes.ts'
import { useAsRefGet } from '@@/utils/react/state/useAsRefGet.ts'
import { useAsStateAndRef } from '@@/utils/react/state/useAsStateAndRef.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { useStateAndRef } from '@@/utils/react/state/useStateAndRef.ts'
import { use, useEffectEvent, useLayoutEffect } from 'react'




// ⚠️ Browser-Initiated Fullscreen (F11) is not controlled by
// <Element>.requestFullscreen() & <Document>.exitFullscreen()
// and has no fullscreenchange events.

// TODO detect PWA fullscreen
// TODO Check toggle by modals



// Elements that toggle fullscreen must have one of these classes to prevent unnecessary toggling.
const f = '.fscreen-on,.fscreen-off'



export type FullscreenManagerProps = Children & {
  resumeByGesture?: boolean | undefined
  resumeByConfirmation?: boolean | undefined
  navUiAuto?: boolean | undefined
  navUiShow?: boolean | undefined
  navUiHide?: boolean | undefined
}

export default function HtmlFullscreenProvider(props: FullscreenManagerProps) {
  const {
    resumeByGesture, resumeByConfirmation,
    navUiAuto, navUiShow, navUiHide,
    children,
  } = props
  
  const byGesture = !!resumeByGesture
  const byConfirmation = !byGesture && !!resumeByConfirmation
  const canNeedEnter = byGesture || byConfirmation
  
  const isPwa = useIsPwa()
  
  // Is fullscreen mode available
  const [available, getAvailable] = useAsStateAndRef(getFullscreenAvailable() && !isPwa)
  // Is user enabled fullscreen
  const { state: enabled, get: getEnabled, set: setEnabled } = useStateAndRef(false)
  // Is document in fullscreen
  const { state: active, get: getActive, set: setActive } = useStateAndRef(getFullscreenActive())
  // Is there active fullscreen transition (pending fullscreen enter / exit promise)
  const {
    state: transitioning, get: getTransitioning, set: setTransitioning,
  } = useStateAndRef(false)
  
  // Need action to enter fullscreen
  const getNeedEnter = () => canNeedEnter && !getTransitioning() && getEnabled() && !getActive()
  const needEnter = canNeedEnter && !transitioning && enabled && !active
  
  // Need gesture to enter fullscreen
  const getNeedGesture = () => byGesture && !getTransitioning() && getNeedEnter()
  
  // Need explicit confirmation (modal dialog) to enter fullscreen
  const needConfirmation = byConfirmation && !transitioning && needEnter
  
  const [getLastRestored, setLastRestored] = useRefGetSet<PageLifecycleEv | undefined>(undefined)
  const pageLContext = use(PageLifecycleContext)
  useLayoutEffect(() => {
    const onPageL = (ev: PageLifecycleEv) => {
      if (ev.transition === 'Restored') setLastRestored(ev)
    }
    pageLContext.on(onPageL)
    return () => { pageLContext.off(onPageL) }
  }, [pageLContext])
  
  
  // Listen for browser enter / exit fullscreen
  useLayoutEffect(() => {
    const onFullscreen = (ev: Event) => {
      const active = getFullscreenActive()
      setActive(active)
      
      // If there is recent page restore event and exit fullscreen
      // then it is browser (not user) who exited fullscreen via page hiding.
      // On user enter / exit event is removed.
      const wasBrowserExit = !active && (getLastRestored()?.ts ?? 0) >= ev.timeStamp - 200
      if (!active && !wasBrowserExit) setEnabled(false)
      
      //console.log('fullscreenchange', active, 'ts', ev.timeStamp)
    }
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => { document.removeEventListener('fullscreenchange', onFullscreen) }
  }, [])
  
  
  async function enter() {
    setLastRestored(undefined)
    setEnabled(true)
    const canGoFullscreen = !getTransitioning() && getAvailable() && getGestureHaveActivation()
    if (canGoFullscreen) try {
      setTransitioning(true)
      // @ts-expect-error
      const opts: FullscreenOptions = {
        navigationUI: navUiAuto ? 'auto' : navUiHide ? 'hide' : navUiShow ? 'show' : undefined,
      }
      await requestHtmlFullscreen(opts)
      setActive(true)
    }
    finally {
      setTransitioning(false)
    }
  }
  
  async function exit() {
    setLastRestored(undefined)
    setEnabled(false)
    const canExitFullscreen = !getTransitioning() && getFullscreenActive()
    if (canExitFullscreen) try {
      setTransitioning(true)
      await exitFullscreen()
      setActive(false)
    }
    finally {
      setTransitioning(false)
    }
  }
  
  
  const syncFullscreen = useEffectEvent(() => {
    if (!transitioning) {
      if (enabled && !active && !canNeedEnter) setEnabled(false)
      if (!enabled && active) exit()
    }
  })
  useLayoutEffect(syncFullscreen, [transitioning, active, enabled])
  
  
  const tryGoFullscreen = useEffectEvent((target: any) => {
    const toggler = isElement(target) && target.closest(f)
    if (!toggler && getNeedGesture()) enter()
  })
  useLayoutEffect(() => {
    const tryFullscreen = (ev: Event) => { tryGoFullscreen(ev.target) }
    window.addEventListener('click', tryFullscreen)
    window.addEventListener('dblclick', tryFullscreen)
    window.addEventListener('mousedown', tryFullscreen)
    window.addEventListener('mouseup', tryFullscreen)
    window.addEventListener('touchend', tryFullscreen)
    window.addEventListener('pointerdown', tryFullscreen)
    window.addEventListener('pointerup', tryFullscreen)
    window.addEventListener('keydown', tryFullscreen)
    window.addEventListener('keypress', tryFullscreen)
    window.addEventListener('contextmenu', tryFullscreen)
    window.addEventListener('change', tryFullscreen)
    window.addEventListener('submit', tryFullscreen)
    window.addEventListener('reset', tryFullscreen)
    return () => {
      window.removeEventListener('click', tryFullscreen)
      window.removeEventListener('dblclick', tryFullscreen)
      window.removeEventListener('mousedown', tryFullscreen)
      window.removeEventListener('mouseup', tryFullscreen)
      window.removeEventListener('touchend', tryFullscreen)
      window.removeEventListener('pointerdown', tryFullscreen)
      window.removeEventListener('pointerup', tryFullscreen)
      window.removeEventListener('keydown', tryFullscreen)
      window.removeEventListener('keypress', tryFullscreen)
      window.removeEventListener('contextmenu', tryFullscreen)
      window.removeEventListener('change', tryFullscreen)
      window.removeEventListener('submit', tryFullscreen)
      window.removeEventListener('reset', tryFullscreen)
    }
  }, [])

  
  const contextValue = {
    available, enabled, active,
    needEnter, needConfirmation,
    enter, exit,
  }
  
  return (
    <HtmlFullscreenContext value={contextValue}>
      {children}
    </HtmlFullscreenContext>
  )
}




// Actually it seems document.fullscreenEnabled value is not changed during document lifecycle.
// I've tried to dynamically change fullscreen attrs on iframe and it has no effect.
const getFullscreenAvailable = () => document.fullscreenEnabled
const getFullscreenActive = () => !!document.fullscreenElement
// Check if gesture activation effect is enabled.
// Usually activation effect lasts 5 secs.
const getGestureHaveActivation = () => navigator.userActivation.isActive
// { navigationUI: 'show' } does not hide bottom navigation island on android
const requestHtmlFullscreen = (opts?: FullscreenOptions) => document.documentElement
  .requestFullscreen(opts)
const exitFullscreen = () => document.exitFullscreen()
