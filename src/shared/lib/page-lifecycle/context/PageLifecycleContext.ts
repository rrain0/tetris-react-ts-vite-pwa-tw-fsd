import {
  type OnPageState,
} from '@@/lib/page-lifecycle/model/page-lifecycle.ts'
import type { Cb1 } from '@@/utils/ts/ts.ts'
import { createContext } from 'react'



export type PageLifecycleContextValue = {
  on: Cb1<OnPageState>
  off: Cb1<OnPageState>
}

export const PageLifecycleContext = createContext<PageLifecycleContextValue>({
  on: () => { },
  off: () => { },
})
