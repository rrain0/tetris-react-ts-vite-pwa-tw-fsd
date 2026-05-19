import { noop } from '@@/utils/js/constants.ts'
import type { Cb } from '@@/utils/ts/ts.ts'
import { createContext } from 'react'



export type HtmlFullscreenContextValue = {
  available: boolean
  enabled: boolean
  active: boolean
  needEnter: boolean
  needConfirmation: boolean
  enter: Cb
  exit: Cb
}

export const HtmlFullscreenContext = createContext<HtmlFullscreenContextValue>({
  available: false,
  enabled: false,
  active: false,
  needEnter: false,
  needConfirmation: false,
  enter: noop,
  exit: noop,
})
