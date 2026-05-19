import {
  NativeGamepadContext,
  type NativeGamepadContextValue,
} from '@@/lib/input/gamepad-input/native/context/NativeGamepadContext.ts'
import {
  type NativeGamepadConnectedEv, type NativeGamepadDisconnectedEv,
  type NativeGamepadEv, type NativeGamepadId,
  type NativeGamepad, type NativeGamepadPolledEv,
  gamepadToNativeGamepadId, gamepadToNativeGamepad,
} from '@@/lib/input/gamepad-input/native/model/nativeGamepad.model.ts'
import type { Children } from '@@/utils/react/props/propTypes.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { type Cb, type EvCb } from '@@/utils/ts/ts.ts'
import { useLayoutEffect } from 'react'



export default function NativeGamepadProvider({ children }: Children) {
  const [getListeners] = useRefGetSet<Set<EvCb<NativeGamepadEv>>>(new Set())
  
  type NativeGamepadsMap = Map<NativeGamepadId, NativeGamepad | undefined>
  const [getGamepads] = useRefGetSet<NativeGamepadsMap>(new Map())
  const [getStopOnRaf, setStopOnRaf] = useRefGetSet<Cb | undefined>(undefined)
  
  const createOnRaf = () => {
    let stop = false
    const stopOnRaf = () => { stop = true }
    
    const onRaf = () => {
      if (stop) return
      
      //console.log('raf')
      
      const ts = document.timeline.currentTime as number
      const gpsRaw = navigator.getGamepads()
      
      for (const gpRaw of gpsRaw) if (gpRaw) {
        const gps = getGamepads()
        const gp = gamepadToNativeGamepad(gpRaw)
        gps.set(gp.id, gp)
      }
      
      const ev: NativeGamepadPolledEv = {
        type: 'nativeGamepadPolled',
        ts,
      }
      for (const l of getListeners()) l(ev)
      
      requestAnimationFrame(onRaf)
    }
    
    return { onRaf, stopOnRaf }
  }
  
  const tryStartOnRaf = () => {
    const rafStarted = !!getStopOnRaf()
    const anyGamepad = navigator.getGamepads().some(it => !!it)
    const anyListeners = !!getListeners().size
    const windowFocused = document.hasFocus()
    if (!rafStarted && anyListeners && anyGamepad && windowFocused) {
      const { onRaf, stopOnRaf } = createOnRaf()
      setStopOnRaf(stopOnRaf)
      requestAnimationFrame(onRaf)
    }
  }
  const stopOnRaf = () => {
    getStopOnRaf()?.()
    setStopOnRaf(undefined)
  }
  const tryStopOnRaf = () => {
    const anyGamepad = navigator.getGamepads().some(it => !!it)
    const anyListeners = !!getListeners().size
    const windowFocused = document.hasFocus()
    if (!anyGamepad || !anyListeners || !windowFocused) stopOnRaf()
  }
  
  useLayoutEffect(() => {
    const onGamepadConnected = (ev: GamepadEvent) => {
      const gp = ev.gamepad
      
      //const { index: i, id, buttons: { length: buttonsCnt }, axes: { length: axesCnt } } = gp
      //console.log(
      // `Gamepad connected, index: ${i}, id: ${id}, ${buttonsCnt} buttons, ${axesCnt} axes`
      //)
      //console.log('gamepad', ev)
      //console.log('gamepads', navigator.getGamepads())
      
      // ⚠️ Внутри этого 'gamepaddisconnected' эвента у геймпада везде в осях и кнопках стоят нули,
      // ⚠️ так что по сути состояние undefined.
      // ⚠️ В первом raf после этого эвента уже реальные значения.
      
      const gpId = gamepadToNativeGamepadId(gp)
      const state = getGamepads()
      
      if (!state.has(gpId)) {
        console.log(`connected ${gpId}`)
        
        // Add gamepad with state undefined yet
        getGamepads().set(gpId, undefined)
        
        const newEv: NativeGamepadConnectedEv = {
          type: 'nativeGamepadConnected',
          ts: ev.timeStamp,
          gpId,
        }
        for (const l of getListeners()) l(newEv)
      }
      
      tryStartOnRaf()
    }
    
    const onGamepadDisconnected = (ev: GamepadEvent) => {
      const gp = ev.gamepad
      
      //const { index: i, id, buttons: { length: buttonsCnt }, axes: { length: axesCnt } } = gp
      //console.log(
      // `Gamepad disconnected, index: ${i}, id: ${id}, ${buttonsCnt} buttons, ${axesCnt} axes`
      //)
      //console.log('gamepad', ev)
      //console.log('gamepads', navigator.getGamepads())
      
      const gpId = gamepadToNativeGamepadId(gp)
      const state = getGamepads()
      
      if (state.has(gpId)) {
        console.log(`disconnected ${gpId}`)
        
        // Remove disconnected gamepad state
        state.delete(gpId)
        
        const newEv: NativeGamepadDisconnectedEv = {
          type: 'nativeGamepadDisconnected',
          ts: ev.timeStamp,
          gpId,
        }
        for (const l of getListeners()) l(newEv)
      }
      
      tryStopOnRaf()
    }
    
    const onFocus = () => { tryStartOnRaf() }
    const onBlur = () => { tryStopOnRaf() }
    
    window.addEventListener('gamepadconnected', onGamepadConnected)
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected)
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('gamepadconnected', onGamepadConnected)
      window.removeEventListener('gamepaddisconnected', onGamepadDisconnected)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
      stopOnRaf()
    }
  }, [])
  
  
  
  const nativeGamepadContextValue: NativeGamepadContextValue = {
    getGamepads: getGamepads,
    on: cb => {
      getListeners().add(cb)
      tryStartOnRaf()
    },
    off: cb => {
      getListeners().delete(cb)
      tryStopOnRaf()
    },
  }
  
  
  return (
    <NativeGamepadContext value={nativeGamepadContextValue}>
      {children}
    </NativeGamepadContext>
  )
}
