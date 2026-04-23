import type { InputId, InputType } from '@@/lib/app/input-manager/model/inputManager.model.ts'
import { noop } from '@@/utils/react/state/state.ts'
import { createContext } from 'react'



export type InputManagerContextValue = {
  lock: (type: InputType, inputId: InputId) => void,
  unlock: (type: InputType, inputId: InputId) => void,
  tryLock: (type: InputType, inputId: InputId) => boolean,
  allowed: (type: InputType, inputId: InputId) => boolean,
}

export const InputManagerContext = createContext<InputManagerContextValue>({
  lock: noop,
  unlock: noop,
  tryLock: () => false,
  allowed: () => false,
})
