import {
  GamepadChangeContext,
  type GamepadChangeContextValue,
} from '@lib/gamepad-input/change/context/GamepadChangeContext.ts'
import type { GamepadChangeEv } from '@lib/gamepad-input/change/model/GamepadChange.model.ts'
import {
  MappedGamepadContext,
} from '@lib/gamepad-input/mapped/context/MappedGamepadContext.ts'
import type {
  MappedGamepad,
  MappedGamepadEv, MappedGamepadState,
} from '@lib/gamepad-input/mapped/model/mappedGamepad.model.ts'
import type {
  NativeGamepadId,
} from '@lib/gamepad-input/native/model/nativeGamepad.model.ts'
import { NegInf, PosInf } from '@utils/math/math.ts'
import { rngHas, rngMap } from '@utils/math/range.ts'
import { rf5 } from '@utils/math/rounding.ts'
import type { Children } from '@utils/react/props/propTypes.ts'
import { useRefGetSet } from '@utils/react/state/useRefGetSet.ts'
import { type Cb1, isdef, isundef } from '@utils/ts/ts.ts'
import { use, useLayoutEffect } from 'react'



export default function GamepadChangeProvider({ children }: Children) {
  const mappedGamepadContext = use(MappedGamepadContext)
  
  const [getListeners] = useRefGetSet<Set<Cb1<GamepadChangeEv>>>(new Set())
  
  const [getGamepads, setGamepads] = useRefGetSet<Map<NativeGamepadId, MappedGamepad>>(new Map())
  
  useLayoutEffect(() => {
    const onGamepad = (ev: MappedGamepadEv) => {
      if (ev.type === 'mappedGamepadGotState') {
        const mGps = mappedGamepadContext.getGamepads()
        const nextGps = new Map(mGps.entries().map(
          ([k, v]) => [k, { ...v, state: { ...v.state } }]
        ))
        const gps = getGamepads()
        setGamepads(nextGps)
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
                const signals = [...new Set([...Object.keys(nextGpState), ...Object.keys(gpState)])]
                const changes: MappedGamepadState = { }
                for (let i = 0; i < signals.length; i++) {
                  const signal = signals[i]
                  if (gpState[signal] !== nextGpState[signal]) {
                    changes[signal] = nextGpState[signal]
                    hasChanges = true
                  }
                }
                return changes
              })(),
            })
          }
        }
        
        if (hasChanges) {
          changes.entries().forEach(([gpId, { id, meta, state }]) => {
            console.log(`${gpId} changes:`)
            console.log(state)
          })
          
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
    getGamepads: getGamepads,
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



namespace Test1 {
  
  interface SignalFrom {
    id: string
    
    push?: number | undefined
    pushFrom?: number | undefined
    pushTo?: number | undefined
    
    analogFrom?: number | undefined
    analogTo?: number | undefined
    analogBaseFrom?: number | undefined
    analogBaseTo?: number | undefined
  }
  interface MappingFrom {
    pushMode?: 'and' | 'or' | undefined
    analogMode?: 'min' | 'max' | 'avg' | undefined
    signals: SignalFrom[]
  }
  type MappingsFrom = Record<string, MappingFrom>
  
  interface SignalTo {
    id: string
    
    push?: number | undefined
    
    analogFrom?: number | undefined
    analogTo?: number | undefined
  }
  interface MappingTo {
    xinput?: boolean | undefined
    defaultPush?: boolean | undefined
    defaultAnalog?: number | undefined
    signals: SignalTo[]
  }
  type MappingsTo = Record<string, MappingTo>
  
  
  interface MappedFrom {
    push: boolean | undefined
    analog: number | undefined
  }
  type StateFrom = Record<string, MappedFrom>
  
  interface MappedTo {
    xinput: boolean | undefined
    value: number
    push: boolean
    analog: number
  }
  type StateTo = Record<string, MappedTo>
  
  
  const testMappingsFrom: MappingsFrom = {
    // CASE 1 - Button to Button
    // Virtual Button A from DInput Button A
    'VB.A from DB.A': {
      pushMode: 'and',
      signals: [{ id: 'B2', push: 1 }],
    },
    // CASE 2 - Button+Button to Button+Button
    // Virtual Button LSButton+RSButton from DInput Button LT + DInput Button B
    'VB.LSButton+RSButton from DB.LT+DB.B': {
      pushMode: 'and',
      signals: [{ id: 'B6', push: 1 }, { id: 'B1', push: 1 }],
    },
    // CASE 3 - Analog+Analog to Button+Button
    // Virtual Button LSButton+RSButton from XInput Button LT + XInput Button RT
    'VB.LSButton+RSButton from XB.LT+XB.RT': {
      pushMode: 'and',
      signals: [{ id: 'B6', pushFrom: 0.5 }, { id: 'B7', pushFrom: 0.5 }],
    },
  }
  
  const testMappingsTo: MappingsTo = {
    // CASE 1 - Button to Button
    // A from A to A
    'A': {
      xinput: true,
      signals: [{ id: 'A from A', push: 1 }],
    },
    // CASE 2 - Button+Button to Button+Button
    // LSButton+RSButton from LT+B to LSButton
    'LSButton': {
      xinput: true,
      signals: [{ id: 'LSButton+RSButton from LT+B', push: 1 }],
    },
    // CASE 2 - Button+Button to Button+Button
    // LSButton+RSButton from LT+B to RSButton
    'RSButton': {
      xinput: true,
      signals: [{ id: 'LSButton+RSButton from LT+B', push: 1 }],
    },
  }
  
  function map() {
    
    const inState: Record<string, number> = {
      'B1': 0,
      'B2': 0,
      'B3': 1,
      'B6': 1,
      'B7': 1,
    }
    
    const stateFrom: StateFrom = Object.fromEntries(
      Object.entries(testMappingsFrom).map(([id, m]) => {
        const state: MappedFrom = {
          push: undefined,
          analog: undefined,
        }
        let cnt = 0
        
        const addPush = (mode: 'and' | 'or' = 'and', isPush: boolean) => {
          if (isundef(state.push)) state.push = isPush
          else if (mode === 'and') state.push &&= isPush
          else if (mode === 'or') state.push ||= isPush
        }
        
        const addAnalog = (mode: 'min' | 'max' | 'avg' = 'max', analog: number) => {
          if (isundef(state.analog)) state.analog = analog
          else if (mode === 'min') {
            state.analog = Math.min(state.analog, analog)
            cnt++
          }
          else if (mode === 'max') {
            state.analog = Math.max(state.analog, analog)
            cnt++
          }
          else if (mode === 'avg') {
            state.analog = rf5((state.analog * cnt + analog) / (cnt + 1))
            cnt++
          }
        }
        
        m.signals.forEach(s => {
          const {
            id,
            pushFrom, pushTo, push,
            analogFrom, analogTo, analogBaseFrom, analogBaseTo,
          } = s
          const inS = inState[id]
          
          if (isdef(inS)) {
            const inV = rf5(inS)
            
            const hasPushRange = isdef(pushFrom) || isdef(pushTo)
            const hasPush = isdef(push)
            if (hasPushRange) {
              const pFrom = pushFrom ?? NegInf
              const pTo = pushTo ?? PosInf
              const isPush = rngHas(inV, [pFrom, pTo])
              addPush(m.pushMode, isPush)
            }
            else if (hasPush) {
              const isPush = inV === push
              addPush(m.pushMode, isPush)
            }
            
            const hasAnalog = isdef(analogFrom) || isdef(analogTo)
            if (hasAnalog) {
              const aFrom = analogFrom ?? 0
              const aTo = analogTo ?? 1
              if (rngHas(inV, [aFrom, aTo])) {
                const aBaseFrom = analogBaseFrom ?? aFrom
                const aBaseTo = analogBaseTo ?? aTo
                const vIn0To1 = rngMap(inV, [aBaseFrom, aBaseTo], [0, 1])
                addAnalog(m.analogMode, vIn0To1)
              }
            }
          }
        })
        return [id, state]
      })
    )
    
    console.log('stateFrom', stateFrom)
    
    const stateTo: StateTo = Object.fromEntries(
      Object.entries(testMappingsTo).map(([id, v]) => {
        const { xinput, defaultPush = false, defaultAnalog = 0, signals } = v
        let value: number | undefined
        let push: boolean | undefined
        let analog: number | undefined
        for (const signal of signals) {
          const { id, push: p, analogFrom, analogTo } = signal
          const s = stateFrom[id]
          if (s) {
            push ||= s.push
            if (isdef(p) && s.push) value = p
            
            
          }
        }
        push ??= defaultPush
        analog ??= defaultAnalog
        value ??= defaultAnalog
        return [id, { xinput, value, push, analog }]
      })
    )
  }
  
  // console.time('map')
  // map()
  // console.timeEnd('map')
  
}




type Signal = {
  id: string
  xinput?: boolean | undefined
  // Значение нажатой кнопки
  on?: number
  // Диапазон нажатой кнопки
  onRange?: { from?: number, to?: number }
  // Диапазон аналогового сигнала
  range?: { from?: number, to?: number }
  // Дефолтное значение, когда маппинг сигнала отсутствует
  off?: number // if needed then default is 0
}
type SignalMapping = {
  from: Signal[]
  to: Signal[]
}
type SignalMappings = SignalMapping[]



const DInputSignalToXInputMappings: SignalMappings = [
  // A
  {
    from: [{ id: 'B2' }],
    to: [{ id: 'A', xinput: true }],
  },
  // B
  {
    from: [{ id: 'B1' }],
    to: [{ id: 'B', xinput: true }],
  },
  // X
  {
    from: [{ id: 'B3' }],
    to: [{ id: 'X', xinput: true }],
  },
  // Y
  {
    from: [{ id: 'B0' }],
    to: [{ id: 'Y', xinput: true }],
  },
  
  // Select
  {
    from: [{ id: 'B8' }],
    to: [{ id: 'Select', xinput: true }],
  },
  // Start
  {
    from: [{ id: 'B9' }],
    to: [{ id: 'Start', xinput: true }],
  },
  
  // LB
  {
    from: [{ id: 'B4' }],
    to: [{ id: 'LB', xinput: true }],
  },
  // RB
  {
    from: [{ id: 'B5' }],
    to: [{ id: 'RB', xinput: true }],
  },
  
  // LSButton
  {
    from: [{ id: 'B10' }],
    to: [{ id: 'LSButton', xinput: true }],
  },
  // RSButton
  {
    from: [{ id: 'B11' }],
    to: [{ id: 'RSButton', xinput: true }],
  },
  
  // LT
  {
    from: [{ id: 'B6' }],
    to: [{ id: 'LT', xinput: true }],
  },
  // RT
  {
    from: [{ id: 'B7' }],
    to: [{ id: 'RT', xinput: true }],
  },
  
  // LXLeft (from DPadL)
  {
    from: [{ id: 'A0', range: { from: 0, to: -1 } }],
    to: [{ id: 'LXLeft', xinput: true, range: { from: 0, to: 1 } }],
  },
  // LXRight (from DPadR)
  {
    from: [{ id: 'A0', range: { from: 0, to: 1 } }],
    to: [{ id: 'LXRight', xinput: true, range: { from: 0, to: 1 } }],
  },
  // LYDown (from DPadD)
  {
    from: [{ id: 'A1', range: { from: 0, to: 1 } }],
    to: [{ id: 'LXDown', xinput: true, range: { from: 0, to: 1 } }],
  },
  // LYUp (from DPadU)
  {
    from: [{ id: 'A1', range: { from: 0, to: -1 } }],
    to: [{ id: 'LXUp', xinput: true, range: { from: 0, to: 1 } }],
  },
]



const PS3SignalToXInputMappings: SignalMappings = [
  // A
  {
    from: [{ id: 'B2' }],
    to: [{ id: 'A', xinput: true }],
  },
  // B
  {
    from: [{ id: 'B1' }],
    to: [{ id: 'B', xinput: true }],
  },
  // X
  {
    from: [{ id: 'B3' }],
    to: [{ id: 'X', xinput: true }],
  },
  // Y
  {
    from: [{ id: 'B0' }],
    to: [{ id: 'Y', xinput: true }],
  },
  
  // Select
  {
    from: [{ id: 'B8' }],
    to: [{ id: 'Select', xinput: true }],
  },
  // Start
  {
    from: [{ id: 'B9' }],
    to: [{ id: 'Start', xinput: true }],
  },
  
  // LB
  {
    from: [{ id: 'B4' }],
    to: [{ id: 'LB', xinput: true }],
  },
  // RB
  {
    from: [{ id: 'B5' }],
    to: [{ id: 'RB', xinput: true }],
  },
  
  // LSButton
  {
    from: [{ id: 'B10' }],
    to: [{ id: 'LSButton', xinput: true }],
  },
  // RSButton
  {
    from: [{ id: 'B11' }],
    to: [{ id: 'RSButton', xinput: true }],
  },
  
  // LT
  {
    from: [{ id: 'B6' }],
    to: [{ id: 'LT', xinput: true }],
  },
  // RT
  {
    from: [{ id: 'B7' }],
    to: [{ id: 'RT', xinput: true }],
  },
  
  // DPadL
  {
    from: [{ id: 'A9', on: 0.71429 }], // (from DPadL)
    to: [{ id: 'DPadL', xinput: true }],
  },
  {
    from: [{ id: 'A9', on: 0.42857 }], // (from DPadDL)
    to: [{ id: 'DPadL', xinput: true }],
  },
  {
    from: [{ id: 'A9', on: 1.00000 }], // (from DPadUL)
    to: [{ id: 'DPadL', xinput: true }],
  },
  // DPadR
  {
    from: [{ id: 'A9', on: -0.42857 }], // (from DPadR)
    to: [{ id: 'DPadR', xinput: true }],
  },
  {
    from: [{ id: 'A9', on: -0.14286 }], // (from DPadDR)
    to: [{ id: 'DPadR', xinput: true }],
  },
  {
    from: [{ id: 'A9', on: -0.71429 }], // (from DPadUR)
    to: [{ id: 'DPadR', xinput: true }],
  },
  // DPadD
  {
    from: [{ id: 'A9', on: 0.14286 }], // (from DPadD)
    to: [{ id: 'DPadD', xinput: true }],
  },
  {
    from: [{ id: 'A9', on: 0.42857 }], // (from DPadDL)
    to: [{ id: 'DPadD', xinput: true }],
  },
  {
    from: [{ id: 'A9', on: -0.14286 }], // (from DPadDR)
    to: [{ id: 'DPadD', xinput: true }],
  },
  // DPadU
  {
    from: [{ id: 'A9', on: -1.00000 }], // (from DPadU)
    to: [{ id: 'DPadU', xinput: true }],
  },
  {
    from: [{ id: 'A9', on: 1.00000 }], // (from DPadUL)
    to: [{ id: 'DPadU', xinput: true }],
  },
  {
    from: [{ id: 'A9', on: -0.71429 }], // (from DPadUR)
    to: [{ id: 'DPadU', xinput: true }],
  },
  
  // LXLeft
  {
    from: [{ id: 'A0', range: { from: 0, to: -1 } }],
    to: [{ id: 'LXLeft', xinput: true, range: { from: 0, to: 1 } }],
  },
  // LXRight
  {
    from: [{ id: 'A0', range: { from: 0, to: 1 } }],
    to: [{ id: 'LXRight', xinput: true, range: { from: 0, to: 1 } }],
  },
  // LYDown
  {
    from: [{ id: 'A1', range: { from: 0, to: 1 } }],
    to: [{ id: 'LXDown', xinput: true, range: { from: 0, to: 1 } }],
  },
  // LYUp
  {
    from: [{ id: 'A1', range: { from: 0, to: -1 } }],
    to: [{ id: 'LXUp', xinput: true, range: { from: 0, to: 1 } }],
  },
  
  // RXLeft
  {
    from: [{ id: 'A2', range: { from: 0, to: -1 } }],
    to: [{ id: 'RXLeft', xinput: true, range: { from: 0, to: 1 } }],
  },
  // RXRight
  {
    from: [{ id: 'A2', range: { from: 0, to: 1 } }],
    to: [{ id: 'RXRight', xinput: true, range: { from: 0, to: 1 } }],
  },
  // RYDown
  {
    from: [{ id: 'A5', range: { from: 0, to: 1 } }],
    to: [{ id: 'RXDown', xinput: true, range: { from: 0, to: 1 } }],
  },
  // RYUp
  {
    from: [{ id: 'A5', range: { from: 0, to: -1 } }],
    to: [{ id: 'RXUp', xinput: true, range: { from: 0, to: 1 } }],
  },
]



const XInputSignalToXInputMappings: SignalMappings = [
  // A
  {
    from: [{ id: 'B0' }],
    to: [{ id: 'A', xinput: true }],
  },
  // B
  {
    from: [{ id: 'B1' }],
    to: [{ id: 'B', xinput: true }],
  },
  // X
  {
    from: [{ id: 'B2' }],
    to: [{ id: 'X', xinput: true }],
  },
  // Y
  {
    from: [{ id: 'B3' }],
    to: [{ id: 'Y', xinput: true }],
  },
  
  // Select
  {
    from: [{ id: 'B8' }],
    to: [{ id: 'Select', xinput: true }],
  },
  // Start
  {
    from: [{ id: 'B9' }],
    to: [{ id: 'Start', xinput: true }],
  },
  
  // LB
  {
    from: [{ id: 'B4' }],
    to: [{ id: 'LB', xinput: true }],
  },
  // RB
  {
    from: [{ id: 'B5' }],
    to: [{ id: 'RB', xinput: true }],
  },
  
  // LSButton
  {
    from: [{ id: 'B10' }],
    to: [{ id: 'LSButton', xinput: true }],
  },
  // RSButton
  {
    from: [{ id: 'B11' }],
    to: [{ id: 'RSButton', xinput: true }],
  },
  
  // LT
  {
    from: [{ id: 'B6' }],
    to: [{ id: 'LT', xinput: true }],
  },
  // RT
  {
    from: [{ id: 'B7' }],
    to: [{ id: 'RT', xinput: true }],
  },
  
  // DPadL
  {
    from: [{ id: 'B14' }],
    to: [{ id: 'DPadL', xinput: true }],
  },
  // DPadR
  {
    from: [{ id: 'B15' }],
    to: [{ id: 'DPadR', xinput: true }],
  },
  // DPadD
  {
    from: [{ id: 'B13' }],
    to: [{ id: 'DPadD', xinput: true }],
  },
  // DPadU
  {
    from: [{ id: 'B12' }],
    to: [{ id: 'DPadU', xinput: true }],
  },
  
  // LXLeft
  {
    from: [{ id: 'A0', range: { from: 0, to: -1 } }],
    to: [{ id: 'LXLeft', xinput: true, range: { from: 0, to: 1 } }],
  },
  // LXRight
  {
    from: [{ id: 'A0', range: { from: 0, to: 1 } }],
    to: [{ id: 'LXRight', xinput: true, range: { from: 0, to: 1 } }],
  },
  // LYDown
  {
    from: [{ id: 'A1', range: { from: 0, to: 1 } }],
    to: [{ id: 'LXDown', xinput: true, range: { from: 0, to: 1 } }],
  },
  // LYUp
  {
    from: [{ id: 'A1', range: { from: 0, to: -1 } }],
    to: [{ id: 'LXUp', xinput: true, range: { from: 0, to: 1 } }],
  },
  
  // RXLeft
  {
    from: [{ id: 'A2', range: { from: 0, to: -1 } }],
    to: [{ id: 'RXLeft', xinput: true, range: { from: 0, to: 1 } }],
  },
  // RXRight
  {
    from: [{ id: 'A2', range: { from: 0, to: 1 } }],
    to: [{ id: 'RXRight', xinput: true, range: { from: 0, to: 1 } }],
  },
  // RYDown
  {
    from: [{ id: 'A3', range: { from: 0, to: 1 } }],
    to: [{ id: 'RXDown', xinput: true, range: { from: 0, to: 1 } }],
  },
  // RYUp
  {
    from: [{ id: 'A3', range: { from: 0, to: -1 } }],
    to: [{ id: 'RXUp', xinput: true, range: { from: 0, to: 1 } }],
  },
]
