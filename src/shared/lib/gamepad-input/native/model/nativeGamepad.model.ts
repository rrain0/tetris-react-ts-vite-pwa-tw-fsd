


export type NativeGamepadId = string
export interface NativeGamepadMeta {
  name: string
  i: number
  buttonsCnt: number
  axesCnt: number
  mapping: string
}
export type NativeGamepadSignalId = string
export type NativeGamepadSignalValue = number
export type NativeGamepadState = Record<NativeGamepadSignalId, NativeGamepadSignalValue>

export interface NativeGamepad {
  id: NativeGamepadId
  meta: NativeGamepadMeta
  updatedAt: number
  state?: NativeGamepadState | undefined
}

export type NativeGamepads = ReadonlyMap<NativeGamepadId, NativeGamepad | undefined>

export function gamepadToNativeGamepadMeta(gp: Gamepad): NativeGamepadMeta {
  const {
    // This so-called "id" is not unique here so it is just name
    id: name,
    index: i,
    buttons: { length: buttonsCnt },
    axes: { length: axesCnt },
    mapping,
  } = gp
  return { name, i, buttonsCnt, axesCnt, mapping }
}
export function gamepadToNativeGamepadId(gp: Gamepad): NativeGamepadId {
  return JSON.stringify(gamepadToNativeGamepadMeta(gp))
}
export function gamepadToNativeGamepad(gp: Gamepad): NativeGamepad {
  const { name, i, buttonsCnt, axesCnt, mapping } = gamepadToNativeGamepadMeta(gp)
  return {
    id: gamepadToNativeGamepadId(gp),
    meta: { name, i, buttonsCnt, axesCnt, mapping },
    updatedAt: gp.timestamp,
    state: Object.fromEntries([
      ...gp.buttons.map((it, i) => [`B${i}`, it.value]),
      ...gp.axes.map((it, i) => [`A${i}`, it]),
    ]),
  }
}




export type NativeGamepadEv =
  | NativeGamepadConnectedEv
  | NativeGamepadDisconnectedEv
  | NativeGamepadPolledEv

export interface NativeGamepadConnectedEv {
  type: 'nativeGamepadConnected'
  ts: number
  gpId: NativeGamepadId
}
export interface NativeGamepadDisconnectedEv {
  type: 'nativeGamepadDisconnected'
  ts: number
  gpId: NativeGamepadId
}
export interface NativeGamepadPolledEv {
  type: 'nativeGamepadPolled'
  ts: number
}
