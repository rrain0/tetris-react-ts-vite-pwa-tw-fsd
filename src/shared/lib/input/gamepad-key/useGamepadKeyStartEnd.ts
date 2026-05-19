import {
  GamepadChangeContext,
} from '@@/lib/input/gamepad-input/change/context/GamepadChangeContext.ts'
import type {
  GamepadChangeEv,
} from '@@/lib/input/gamepad-input/change/model/gamepadChange.model.ts'
import type {
  MappedGamepadSignalId,
} from '@@/lib/input/gamepad-input/mapped/model/mappedGamepad.model.ts'
import type {
  NativeGamepadId,
} from '@@/lib/input/gamepad-input/native/model/nativeGamepad.model.ts'
import { useMap } from '@@/utils/react/more/useMap.ts'
import { useAsCb } from '@@/utils/react/state/useAsCb.ts'
import { type EvCb, isbool } from '@@/utils/ts/ts.ts'
import React, { use, useLayoutEffect } from 'react'




export function useGamepadKeyStartEnd<T = Element>(
  onGamepadKeyStartEnd: GamepadKeyStartEndEvHandler, // unstable
) {
  const onGamepadKeyStartEndCb = useAsCb(onGamepadKeyStartEnd)
  
  
  // ⬤⬤ State layer ⬤⬤
  
  const state = useMap<GamepadKeyId, GamepadKey>()
  const startKey = (key: GamepadKey) => {
    state.set(key.keyId, key)
  }
  const endKey = (key: GamepadKey) => {
    state.set(key.keyId, undefined)
  }
  const hasKey = (key: GamepadKey) => {
    return state.has(key.keyId)
  }
  const cancelAllKeys = () => {
    state.clear()
  }
  const getAllKeys = () => {
    return state.getAll()
  }
  
  
  // ⬤⬤ Event layer ⬤⬤
  
  // Save the pressed button.
  const startEv = (ev: KeyEv) => {
    const keyStartEv: GamepadKeyStartEndEv = {
      type: 'gamepadKeyStart',
      ts: ev.ts,
      gpId: ev.gpId,
      signalId: ev.signalId,
      keyId: ev.keyId,
    }
    startKey(ev)
    onGamepadKeyStartEndCb(keyStartEv)
  }
  // Check if there is keyDown for current button & remove saved button.
  const endEv = (ev: KeyEv) => {
    if (hasKey(ev)) {
      const keyEndEv: GamepadKeyStartEndEv = {
        type: 'gamepadKeyEnd',
        ts: ev.ts,
        gpId: ev.gpId,
        signalId: ev.signalId,
        keyId: ev.keyId,
      }
      endKey(ev)
      onGamepadKeyStartEndCb(keyEndEv)
    }
  }
  const cancelAllEvs = (ev: React.FocusEvent<T>) => {
    for (const [keyId, key] of getAllKeys()) {
      const keyEndEv: GamepadKeyStartEndEv = {
        type: 'gamepadKeyEnd',
        ts: ev.timeStamp,
        gpId: key.gpId,
        signalId: key.signalId,
        keyId: key.keyId,
      }
      onGamepadKeyStartEndCb(keyEndEv)
    }
    cancelAllKeys()
  }
  
  
  // ⬤⬤ Browser event layer ⬤⬤
  
  // When the focus is lost from the element tree, we delete all saved buttons.
  const onBlur: React.FocusEventHandler<T> = ev => {
    cancelAllEvs(ev)
  }
  
  
  // ⬤⬤ Gamepad change event layer ⬤⬤
  
  const gamepadChangeContextValue = use(GamepadChangeContext)
  
  useLayoutEffect(() => {
    const onGamepad = (ev: GamepadChangeEv) => {
      if (ev.type === 'gamepadChange') {
        const gps = gamepadChangeContextValue.getGamepads()
        for (const [gpId, { state }] of gps.entries()) {
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
                keyId: getGamepadKeyId(gpId, sId),
              }
              
              if (s) {
                // Start keyhold sequence
                startEv(keyEv)
              }
              else {
                // Finish keyhold sequence
                endEv(keyEv)
              }
            }
          }
        }
      }
    }
    
    gamepadChangeContextValue.on(onGamepad)
    return () => gamepadChangeContextValue.off(onGamepad)
  }, [gamepadChangeContextValue])
  
  
  return { onBlur } // all stable
}



export type GamepadKeyStartEndEvHandler = EvCb<GamepadKeyStartEndEv>
export type GamepadKeyStartEndEv = {
  type: 'gamepadKeyStart' | 'gamepadKeyEnd'
  ts: number
} & GamepadKey



export type GamepadKeyId = string
export type GamepadKey = {
  gpId: NativeGamepadId
  signalId: MappedGamepadSignalId
  keyId: GamepadKeyId
}
export function getGamepadKeyId(
  gpId: NativeGamepadId,
  signalId: MappedGamepadSignalId,
): GamepadKeyId {
  return JSON.stringify({ gpId, signalId })
}



type KeyEv = {
  type: 'key'
  ts: number
} & GamepadKey
