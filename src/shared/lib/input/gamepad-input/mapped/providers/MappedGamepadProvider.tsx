import {
  MappedGamepadContext, type MappedGamepadContextValue,
} from '@@/lib/input/gamepad-input/mapped/context/MappedGamepadContext.ts'
import {
  dInputOldToXXInputMapping
} from '@@/lib/input/gamepad-input/mapped/lib/dInputOldToXXInputMapping.ts'
import {
  dInputPS3ToXXInputMapping
} from '@@/lib/input/gamepad-input/mapped/lib/dInputPS3ToXXInputMapping.ts'
import { xInputToXXInputMapping } from '@@/lib/input/gamepad-input/mapped/lib/xInputToXXInputMapping.ts'
import {
  type MappedGamepad,
  type MappedGamepadEv, type MappedGamepadGotStateEv,
  nativeGamepadStateToMappedState,
} from '@@/lib/input/gamepad-input/mapped/model/mappedGamepad.model.ts'
import { NativeGamepadContext } from '@@/lib/input/gamepad-input/native/context/NativeGamepadContext.ts'
import type {
  NativeGamepadEv,
  NativeGamepadId,
} from '@@/lib/input/gamepad-input/native/model/nativeGamepad.model.ts'
import type { Children } from '@@/utils/react/props/propTypes.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { type EvCb } from '@@/utils/ts/ts.ts'
import { use, useLayoutEffect } from 'react'



export default function MappedGamepadProvider({ children }: Children) {
  const nativeGamepadContext = use(NativeGamepadContext)
  
  const [getListeners] = useRefGetSet<Set<EvCb<MappedGamepadEv>>>(new Set())
  
  type MappedGamepadsMap = Map<NativeGamepadId, MappedGamepad>
  const [getGamepads, setGamepads] = useRefGetSet<MappedGamepadsMap>(new Map())
  
  useLayoutEffect(() => {
    const onGamepad = (ev: NativeGamepadEv) => {
      
      if (ev.type === 'nativeGamepadPolled') {
        const nGps = nativeGamepadContext.getGamepads()
        
        const mGps = new Map<NativeGamepadId, MappedGamepad>()
        for (const [gpId, nGp] of nGps.entries()) {
          if (nGp?.state) {
            const { state, meta: { axesCnt, mapping } } = nGp
            const gpMapping = (() => {
              if (mapping === 'standard') return xInputToXXInputMapping
              if (axesCnt === 4) return xInputToXXInputMapping
              if (axesCnt === 2) return dInputOldToXXInputMapping
              if (axesCnt === 10) return dInputPS3ToXXInputMapping
              return dInputPS3ToXXInputMapping
            })()
            const prev = getGamepads().get(gpId)?.state
            const mGp = { ...nGp, state: nativeGamepadStateToMappedState(state, gpMapping, prev) }
            mGps.set(gpId, mGp)
            //console.log(`${gpId} mapped gamepad state:`)
            //console.log(mGp.state)
          }
        }
        setGamepads(mGps)
        
        const newEv: MappedGamepadGotStateEv = {
          type: 'mappedGamepadGotState',
          ts: ev.ts,
        }
        for (const l of getListeners()) l(newEv)
      }
    }
    
    nativeGamepadContext.on(onGamepad)
    return () => nativeGamepadContext.off(onGamepad)
  }, [nativeGamepadContext])
  
  
  
  const mappedGamepadContextValue: MappedGamepadContextValue = {
    getGamepads: getGamepads,
    on: cb => {
      getListeners().add(cb)
    },
    off: cb => {
      getListeners().delete(cb)
    },
  }
  
  
  return (
    <MappedGamepadContext value={mappedGamepadContextValue}>
      {children}
    </MappedGamepadContext>
  )
}
