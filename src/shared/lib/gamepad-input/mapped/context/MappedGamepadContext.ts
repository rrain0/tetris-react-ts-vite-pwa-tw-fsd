import type {
  MappedGamepadEv, MappedGamepads,
} from '@lib/gamepad-input/mapped/model/mappedGamepad.model.ts'
import type { Cb1, Getter } from '@utils/ts/ts.ts'
import { createContext } from 'react'



export type MappedGamepadContextValue = {
  getGamepads: Getter<MappedGamepads>,
  on: Cb1<Cb1<MappedGamepadEv>>
  off: Cb1<Cb1<MappedGamepadEv>>
}

export const MappedGamepadContext = createContext<MappedGamepadContextValue>({
  getGamepads: () => new Map(),
  on: () => { },
  off: () => { },
})
