import type { MappedGamepad } from '@@/lib/input/gamepad-input/mapped/model/mappedGamepad.model.ts'
import type {
  NativeGamepadId,
} from '@@/lib/input/gamepad-input/native/model/nativeGamepad.model.ts'



export type GamepadChanges = ReadonlyMap<NativeGamepadId, MappedGamepad>



export interface GamepadChangeEv {
  type: 'gamepadChange'
  ts: number
}
