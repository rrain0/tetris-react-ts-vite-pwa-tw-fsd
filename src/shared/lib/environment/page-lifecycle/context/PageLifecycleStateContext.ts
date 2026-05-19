import {
  getInitialPageState,
  type PageState,
  type PageTransition,
} from '@@/lib/environment/page-lifecycle/model/page-lifecycle.model.ts'
import { createContext } from 'react'



export type PageLifecycleStateContextValue = {
  pageState: PageState
  pageTransition: PageTransition | undefined
}

export const PageLifecycleStateContext = createContext<PageLifecycleStateContextValue>({
  pageState: getInitialPageState(),
  pageTransition: undefined,
})
