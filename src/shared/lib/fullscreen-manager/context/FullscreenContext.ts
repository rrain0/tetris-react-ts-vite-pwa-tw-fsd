import type { Cb } from '@@/utils/ts/ts.ts'
import { createContext } from 'react'



export type FullscreenContextValue = {
  available: boolean
  enabled: boolean
  active: boolean
  needEnter: boolean
  needConfirmation: boolean
  enter: Cb
  exit: Cb
}

export const FullscreenContext = createContext<FullscreenContextValue>({
  available: false,
  enabled: false,
  active: false,
  needEnter: false,
  needConfirmation: false,
  enter: () => { },
  exit: () => { },
})
