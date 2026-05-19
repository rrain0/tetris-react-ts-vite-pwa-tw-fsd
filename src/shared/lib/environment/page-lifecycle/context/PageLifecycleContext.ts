import {
  type OnPageLifecycle,
} from '@@/lib/environment/page-lifecycle/model/page-lifecycle.model.ts'
import { noop } from '@@/utils/js/constants.ts'
import type { Cb1 } from '@@/utils/ts/ts.ts'
import { createContext } from 'react'



export type PageLifecycleContextValue = {
  on: Cb1<OnPageLifecycle>
  off: Cb1<OnPageLifecycle>
}

export const PageLifecycleContext = createContext<PageLifecycleContextValue>({
  on: noop,
  off: noop,
})
