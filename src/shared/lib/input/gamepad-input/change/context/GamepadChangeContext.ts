import type {
  GamepadChangeEv,
  GamepadChanges,
} from '@@/lib/input/gamepad-input/change/model/gamepadChange.model.ts'
import type { Cb1, Getter } from '@@/utils/ts/ts.ts'
import { createContext } from 'react'



export type GamepadChangeContextValue = {
  getGamepads: Getter<GamepadChanges>,
  on: Cb1<Cb1<GamepadChangeEv>>
  off: Cb1<Cb1<GamepadChangeEv>>
}

export const GamepadChangeContext = createContext<GamepadChangeContextValue>({
  getGamepads: () => new Map(),
  on: () => { },
  off: () => { },
})
