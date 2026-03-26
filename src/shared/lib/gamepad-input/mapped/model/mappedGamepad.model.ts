import type {
  NativeGamepadId,
  NativeGamepadMeta, NativeGamepadState,
} from '@lib/gamepad-input/native/model/nativeGamepad.model.ts'
import { rngHas, rngMap } from '@utils/math/range.ts'
import { rf5 } from '@utils/math/rounding.ts'
import { isbool, isdef, isnumber } from '@utils/ts/ts.ts'



export type MappedGamepadSignalId = string

export type MappedPushSignal = boolean
export type MappedAnalogSignal = number
export type MappedGamepadSignalValue = MappedPushSignal | MappedAnalogSignal | undefined
export type MappedGamepadState = Record<MappedGamepadSignalId, MappedGamepadSignalValue>

export interface MappedGamepad {
  id: NativeGamepadId
  meta: NativeGamepadMeta
  state: MappedGamepadState
}



export interface SignalMapping {
  signalId: string
  
  push?: number | undefined
  pushOff?: number | undefined
  
  pushFrom?: number | undefined
  pushTo?: number | undefined
  pushOffFrom?: number | undefined
  pushOffTo?: number | undefined
  
  analogFrom?: number | undefined
  analogTo?: number | undefined
  analogBaseFrom?: number | undefined
  analogBaseTo?: number | undefined
}

export interface SignalOperatorMapping {
  operator: 'and' | 'or' | 'not' | 'max' | 'min' | 'avg'
  signals: SignalExpressionMapping[]
}

export type SignalExpressionMapping = SignalMapping | SignalOperatorMapping

export type GamepadMapping = Record<string, SignalExpressionMapping>



export function nativeGamepadStateToMappedState(
  nativeState: NativeGamepadState,
  mapping: GamepadMapping,
  prevMapped?: MappedGamepadState,
): MappedGamepadState {
  return Object.fromEntries(Object.entries(mapping).map(([mSigId, m]) => {
    let mSig = getMappedSignal(nativeState, m, prevMapped)
    if (isnumber(mSig)) mSig = rf5(mSig)
    return [mSigId, mSig]
  }))
}

export function getMappedSignal(
  nativeState: NativeGamepadState,
  signalExprMapping: SignalExpressionMapping,
  prevMapped?: MappedGamepadState,
): MappedGamepadSignalValue {
  let mSig: MappedGamepadSignalValue = undefined
  const sExpr = signalExprMapping
  if ('signalId' in sExpr) {
    let {
      signalId,
      push, pushOff,
      pushFrom, pushTo, pushOffFrom, pushOffTo,
      analogFrom, analogTo, analogBaseFrom, analogBaseTo,
    } = sExpr
    
    const ns = nativeState[signalId]
    
    let p: boolean | undefined = undefined
    let a: number | undefined = undefined
    
    if (isdef(ns)) {
      if (isdef(analogFrom) && isdef(analogTo)) {
        if (rngHas(ns, [analogFrom, analogTo])) {
          analogBaseFrom ??= analogFrom
          analogBaseTo ??= analogTo
          a = rngMap(ns, [analogBaseFrom, analogBaseTo], [0, 1])
        }
      }
      if (isdef(pushOffFrom) && isdef(pushOffTo)) {
        if (rngHas(ns, [pushOffFrom, pushOffTo])) p = false
      }
      if (isdef(pushFrom) && isdef(pushTo)) {
        if (rngHas(ns, [pushFrom, pushTo])) p = true
      }
      if (pushOff) {
        if (ns === pushOff) p = false
      }
      if (push) {
        if (ns === push) p = true
      }
    }
    
    return a ?? p
  }
  else if ('signals' in sExpr) {
    const signals = sExpr.signals.map(it => getMappedSignal(nativeState, it, prevMapped))
    const op = sExpr.operator
    if (op === 'and') {
      mSig = signals.filter(it => isbool(it)).reduce((a, c) => a && c, undefined)
    }
    else if (op === 'or') {
      //@ts-expect-error
      mSig = signals.filter(it => isbool(it)).reduce((a, c) => a || c, undefined)
    }
    else if (op === 'not') {
      if (isbool(signals[0])) mSig = !signals[0]
    }
    else if (op === 'max') {
      //@ts-expect-error
      mSig = signals.filter(it => isnumber(it)).reduce((a, c) => Math.max(a, c), undefined)
    }
    else if (op === 'min') {
      //@ts-expect-error
      mSig = signals.filter(it => isnumber(it)).reduce((a, c) => Math.min(a, c), undefined)
    }
    else if (op === 'avg') {
      let cnt = 1
      mSig = signals.filter(it => isnumber(it))
        //@ts-expect-error
        .reduce((a, c) => cnt / (cnt + 1) * a + c / ++cnt, undefined)
    }
  }
  return mSig
}




export type MappedGamepadEv = MappedGamepadGotStateEv

export interface MappedGamepadGotStateEv {
  type: 'mappedGamepadGotState'
  ts: number
}
