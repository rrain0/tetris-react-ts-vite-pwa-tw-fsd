import { FullscreenContext } from '@@/lib/fullscreen-manager/context/FullscreenContext.ts'
import type { Children } from '@@/utils/react/props/propTypes.ts'
import { useStateAndRef } from '@@/utils/react/state/useStateAndRef.ts'
import { useEffectEvent, useLayoutEffect } from 'react'




// ⚠️ Browser-Initiated Fullscreen (F11) is not controlled by
// <Element>.requestFullscreen() & <Document>.exitFullscreen()

// TODO detect PWA fullscreen
// TODO { navigationUI: 'show' }
// TODO I don't need to auto-toggle fullscreen if user pushed fullscreen button
//  (onClick gesture is last so i need to detect that i do not need auto-toggle)
// TODO I can't detect if user exits fullscreen via back button

export type FullscreenManagerProps = Children & {
  resumeByGesture?: boolean | undefined
  resumeByConfirmation?: boolean | undefined
  navUiAuto?: boolean | undefined
  navUiShow?: boolean | undefined
  navUiHide?: boolean | undefined
}

export default function FullscreenProvider(props: FullscreenManagerProps) {
  const {
    resumeByGesture, resumeByConfirmation,
    navUiAuto, navUiShow, navUiHide,
    children,
  } = props
  
  const byGesture = !!resumeByGesture
  const byConfirmation = !byGesture && !!resumeByConfirmation
  const canNeedEnter = byGesture || byConfirmation
  
  // Is fullscreen mode available
  const available = getFullscreenAvailable()
  // Is user enabled fullscreen
  const { state: enabled, get: getEnabled, set: setEnabled } = useStateAndRef(false)
  // Is document in fullscreen
  const { state: active, get: getActive, set: setActive } = useStateAndRef(getFullscreenActive())
  // Is there active fullscreen transition (pending fullscreen enter / exit promise)
  const {
    state: transitioning, get: getTransitioning, set: setTransitioning,
  } = useStateAndRef(false)
  
  // Waiting for action to go fullscreen
  const getNeedEnter = () => canNeedEnter && getEnabled() && !getActive()
  const needEnter = canNeedEnter && enabled && !active
  // Waiting for gesture to re-enter fullscreen
  const getNeedGesture = () => byGesture && getNeedEnter() && !getTransitioning()
  // Waiting for manual fullscreen re-enter
  const needConfirmation = byConfirmation && needEnter && !transitioning
  
  
  // Listen for browser enter / exit fullscreen
  useLayoutEffect(() => {
    const onFullscreen = (ev: Event) => {
      const active = getFullscreenActive()
      setActive(active)
      
      console.log('fullscreenchange', active, 'ts', ev.timeStamp)
    }
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => { document.removeEventListener('fullscreenchange', onFullscreen) }
  }, [])
  
  
  async function enter() {
    setEnabled(true)
    const canGoFullscreen = !getTransitioning() &&
      getFullscreenAvailable() && getGestureHaveActivation()
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
    if (!canNeedEnter && enabled && !active) setEnabled(false)
    if (active && !enabled) exit()
  })
  useLayoutEffect(() => {
    if (!transitioning) syncFullscreen()
  }, [transitioning, active, enabled])
  
  
  const tryGoFullscreen = useEffectEvent(() => {
    if (getNeedGesture()) enter()
  })
  useLayoutEffect(() => {
    const tryFullscreen = () => { tryGoFullscreen() }
    window.addEventListener('click', tryFullscreen)
    window.addEventListener('dblclick', tryFullscreen)
    window.addEventListener('mouseup', tryFullscreen)
    window.addEventListener('pointerup', tryFullscreen)
    window.addEventListener('mousedown', tryFullscreen)
    window.addEventListener('pointerdown', tryFullscreen)
    window.addEventListener('contextmenu', tryFullscreen)
    window.addEventListener('keydown', tryFullscreen)
    window.addEventListener('keypress', tryFullscreen)
    window.addEventListener('touchend', tryFullscreen)
    window.addEventListener('change', tryFullscreen)
    window.addEventListener('submit', tryFullscreen)
    window.addEventListener('reset', tryFullscreen)
    return () => {
      window.removeEventListener('click', tryFullscreen)
      window.removeEventListener('dblclick', tryFullscreen)
      window.removeEventListener('mouseup', tryFullscreen)
      window.removeEventListener('pointerup', tryFullscreen)
      window.removeEventListener('mousedown', tryFullscreen)
      window.removeEventListener('pointerdown', tryFullscreen)
      window.removeEventListener('contextmenu', tryFullscreen)
      window.removeEventListener('keydown', tryFullscreen)
      window.removeEventListener('keypress', tryFullscreen)
      window.removeEventListener('touchend', tryFullscreen)
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
    <FullscreenContext value={contextValue}>
      {children}
    </FullscreenContext>
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
