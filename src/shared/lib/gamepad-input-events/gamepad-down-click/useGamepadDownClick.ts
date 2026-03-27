import type {
  GamepadKeyDownClickEv,
  GamepadKeyDownClickEvHandler,
} from '@lib/gamepad-input-events/gamepad-down-click/gamepadKeyDownClick.model.ts'
import { GamepadChangeContext } from '@lib/gamepad-input/change/context/GamepadChangeContext.ts'
import type { GamepadChangeEv } from '@lib/gamepad-input/change/model/GamepadChange.model.ts'
import { useAsCb } from '@utils/react/state/useAsCb.ts'
import { use, useLayoutEffect } from 'react'



export function useGamepadDownClick(
  onKeyDownClick: GamepadKeyDownClickEvHandler, // unstable
) {
  const onKeyDownClickCb = useAsCb(onKeyDownClick)
  
  
  // ⬤⬤ Gamepad change event layer ⬤⬤
  
  const gamepadChangeContextValue = use(GamepadChangeContext)
  
  useLayoutEffect(() => {
    const onGamepad = (ev: GamepadChangeEv) => {
      if (ev.type === 'gamepadChange') {
        const gps = gamepadChangeContextValue.getGamepads()
        for (const [gpId,  { state }] of gps.entries()) {
          for (const [sId, s] of Object.entries(state)) {
            if (s === true) {
              // if (sId === 'XX_LXRight_Push') {
              //   console.log(sId, s)
              // }
              const keyEv: GamepadKeyDownClickEv = {
                type: 'gamepadKeyDownClick',
                ts: ev.ts,
                gpId,
                signalId: sId,
              }
              
              onKeyDownClickCb(keyEv)
            }
          }
        }
      }
    }
    
    gamepadChangeContextValue.on(onGamepad)
    return () => gamepadChangeContextValue.off(onGamepad)
  }, [gamepadChangeContextValue])
  
}
