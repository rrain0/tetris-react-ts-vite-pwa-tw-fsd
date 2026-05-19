import type { AppActivities } from '@@/lib/app/activity-manager/model/app-activity.model.ts'
import { createContext } from 'react'



export const AppActivitiesContext = createContext<AppActivities>({
  main: undefined,
  global: undefined,
})
