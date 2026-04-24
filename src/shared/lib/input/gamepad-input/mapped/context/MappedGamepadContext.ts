import type {
  MappedGamepadEv, MappedGamepads,
} from '@@/lib/input/gamepad-input/mapped/model/mappedGamepad.model.ts'
import { noop } from '@@/utils/js/constants.ts'
import { mapOf } from '@@/utils/js/factory.ts'
import type { Cb1, Getter } from '@@/utils/ts/ts.ts'
import { createContext } from 'react'



export type MappedGamepadContextValue = {
  getGamepads: Getter<MappedGamepads>,
  on: Cb1<Cb1<MappedGamepadEv>>
  off: Cb1<Cb1<MappedGamepadEv>>
}

export const MappedGamepadContext = createContext<MappedGamepadContextValue>({
  getGamepads: mapOf,
  on: noop,
  off: noop,
})
