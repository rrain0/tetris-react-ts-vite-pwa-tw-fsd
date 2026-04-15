import {
  GamepadChangeContext,
  type GamepadChangeContextValue,
} from '@@/lib/gamepad-input/change/context/GamepadChangeContext.ts'
import type {
  GamepadChangeEv, GamepadChanges,
} from '@@/lib/gamepad-input/change/model/GamepadChange.model.ts'
import {
  MappedGamepadContext,
} from '@@/lib/gamepad-input/mapped/context/MappedGamepadContext.ts'
import type {
  MappedGamepad,
  MappedGamepadEv, MappedGamepads, MappedGamepadState,
} from '@@/lib/gamepad-input/mapped/model/mappedGamepad.model.ts'
import type {
  NativeGamepadId,
} from '@@/lib/gamepad-input/native/model/nativeGamepad.model.ts'
import type { Children } from '@@/utils/react/props/propTypes.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { type EvCb } from '@@/utils/ts/ts.ts'
import { use, useLayoutEffect } from 'react'



export default function GamepadChangeProvider({ children }: Children) {
  const mappedGamepadContext = use(MappedGamepadContext)
  
  const [getListeners] = useRefGetSet<Set<EvCb<GamepadChangeEv>>>(new Set())
  
  // Saved gamepads
  const [getCurrGamepads, setCurrGamepads] = useRefGetSet<MappedGamepads>(new Map())
  // Changes
  const [getGamepadChanges, setGamepadChanges] = useRefGetSet<GamepadChanges>(new Map())
  
  useLayoutEffect(() => {
    const onGamepad = (ev: MappedGamepadEv) => {
      if (ev.type === 'mappedGamepadGotState') {
        
        const gps = getCurrGamepads()
        const nextGps = mappedGamepadContext.getGamepads()
        setCurrGamepads(nextGps)
        
        const changes = new Map<NativeGamepadId, MappedGamepad>()
        let hasChanges = false
        
        const gpIds = [...new Set([...nextGps.keys(), ...gps.keys()])]
        for (let i = 0; i < gpIds.length; i++) {
          const gpId = gpIds[i]
          
          const gp = gps.get(gpId)
          const nextGp = nextGps.get(gpId)
          
          if (!gp) {
            if (nextGp) {
              changes.set(gpId, nextGp)
              hasChanges = true
            }
          }
          else if (!nextGp) {
            changes.set(gpId, { ...gp, state: { } })
            hasChanges = true
          }
          else {
            changes.set(gpId, {
              ...gp,
              state: (() => {
                const gpState = gp.state
                const nextGpState = nextGp.state
                const signalIds = [...new Set(
                  [...Object.keys(nextGpState), ...Object.keys(gpState)]
                )]
                const changes: MappedGamepadState = { }
                for (let i = 0; i < signalIds.length; i++) {
                  const sId = signalIds[i]
                  if (gpState[sId] !== nextGpState[sId]) {
                    changes[sId] = nextGpState[sId]
                    hasChanges = true
                  }
                }
                return changes
              })(),
            })
          }
        }
        
        if (hasChanges) {
          // changes.entries().forEach(([gpId, { state }]) => {
          //   if (Object.keys(state).some(it => it.endsWith('_Push'))) {
          //     console.log(`changes of ${gpId}:`)
          //     console.log(state)
          //   }
          // })
          
          setGamepadChanges(changes)
          
          const newEv: GamepadChangeEv = {
            type: 'gamepadChange',
            ts: ev.ts,
          }
          for (const l of getListeners()) l(newEv)
        }
      }
    }
    
    mappedGamepadContext.on(onGamepad)
    return () => mappedGamepadContext.off(onGamepad)
  }, [mappedGamepadContext])
  
  
  
  const gamepadChangeContextValue: GamepadChangeContextValue = {
    getGamepads: getGamepadChanges,
    on: cb => {
      getListeners().add(cb)
    },
    off: cb => {
      getListeners().delete(cb)
    },
  }
  
  
  return (
    <GamepadChangeContext value={gamepadChangeContextValue}>
      {children}
    </GamepadChangeContext>
  )
}
