import { GamepadChangeContext } from '@@/lib/input/gamepad-input/change/context/GamepadChangeContext.ts'
import type { GamepadChangeEv } from '@@/lib/input/gamepad-input/change/model/gamepadChange.model.ts'
import type {
  GamepadKeyHoldEv, GamepadKeyHoldEvHandler,
} from '@@/lib/input/gamepad-key-events/gamepad-key-hold/gamepadKeyHold.model.ts'
import type { MappedGamepadSignalId } from '@@/lib/input/gamepad-input/mapped/model/mappedGamepad.model.ts'
import type { NativeGamepadId } from '@@/lib/input/gamepad-input/native/model/nativeGamepad.model.ts'
import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { isbool } from '@@/utils/ts/ts.ts'
import { use, useLayoutEffect } from 'react'




export function useGamepadKeyHold(
  {
    interval = 100, // not updates during hold event
    //delay = 0, // not updates during hold event
  },
  onKeyHold: GamepadKeyHoldEvHandler, // unstable
) {
  const onKeyHoldCb = useAsCb(onKeyHold)
  
  
  // ⬤⬤ State layer ⬤⬤
  
  const [getState] = useRefGetSet(new Map<KeyId, IntervalId>())
  const checkKey = (keyId: KeyId) => {
    return getState().has(keyId)
  }
  const startKey = (keyId: KeyId, intervalId: any) => {
    getState().set(keyId, intervalId)
  }
  const finishKey = (keyId: KeyId) => {
    clearInterval(getState().get(keyId))
    getState().delete(keyId)
  }
  const cancelAllKeys = () => {
    for (const intervalId of getState().values()) clearInterval(intervalId)
    getState().clear()
  }
  
  
  // ⬤⬤ Event layer ⬤⬤
  
  // Save the pressed button.
  const startEv = (ev: KeyEv) => {
    const keyHoldEv: GamepadKeyHoldEv = {
      type: 'gamepadKeyHold',
      ts: ev.ts,
      gpId: ev.gpId,
      signalId: ev.signalId,
    }
    onKeyHoldCb(keyHoldEv)
    const intervalId = setInterval(() => {
      onKeyHoldCb(keyHoldEv)
    }, interval)
    startKey(ev.keyId, intervalId)
  }
  // Check if there is keyDown for current button & remove saved button.
  const finishEv = (ev: KeyEv) => {
    if (checkKey(ev.keyId)) finishKey(ev.keyId)
  }
  const cancelAllEvs = () => {
    cancelAllKeys()
  }
  
  
  // ⬤⬤ Gamepad change event layer ⬤⬤
  
  const gamepadChangeContextValue = use(GamepadChangeContext)
  
  useLayoutEffect(() => {
    const onGamepad = (ev: GamepadChangeEv) => {
      if (ev.type === 'gamepadChange') {
        const gps = gamepadChangeContextValue.getGamepads()
        for (const [gpId,  { state }] of gps.entries()) {
          for (const [sId, s] of Object.entries(state)) {
            if (isbool(s)) {
              // if (sId === 'XX_LXRight_Push') {
              //   console.log(sId, s)
              // }
              const keyEv: KeyEv = {
                type: 'key',
                ts: ev.ts,
                gpId,
                signalId: sId,
                keyId: getKeyId(gpId, sId),
              }
              
              if (s) {
                // Start keyhold sequence
                startEv(keyEv)
              }
              else {
                // Finish keyhold sequence
                finishEv(keyEv)
              }
            }
          }
        }
      }
    }
    
    gamepadChangeContextValue.on(onGamepad)
    return () => gamepadChangeContextValue.off(onGamepad)
  }, [gamepadChangeContextValue])
  
}



type KeyId = string
type IntervalId = any

interface KeyEv {
  type: 'key'
  ts: number
  gpId: string
  signalId: string
  keyId: string
}



function getKeyId(gpId: NativeGamepadId, signalId: MappedGamepadSignalId): KeyId {
  return JSON.stringify({ gpId, signalId })
}
