import {
  getInitialPageState,
  type PageState,
  type PageTransition,
} from '@@/lib/page-lifecycle/model/page-lifecycle.ts'
import { createContext } from 'react'



export type PageLifecycleStateContextValue = {
  pageState: PageState
  pageTransition: PageTransition | undefined
}

export const PageLifecycleStateContext = createContext<PageLifecycleStateContextValue>({
  pageState: getInitialPageState(),
  pageTransition: undefined,
})
