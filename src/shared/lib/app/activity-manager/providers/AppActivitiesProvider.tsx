import { AppActivitiesContext } from '@@/lib/app/activity-manager/context/AppActivitiesContext.ts'
import type {
  AppActivities,
  AppActivity,
} from '@@/lib/app/activity-manager/model/app-activity.model.ts'
import type { Children } from '@@/utils/react/props/propTypes.ts'
import { isdef } from '@@/utils/ts/ts.ts'
import { useState } from 'react'



export type AppActivitiesProviderProps = Children & {
  currentActivity?: string | undefined
}

export default function AppActivitiesProvider({
  currentActivity, children,
}: AppActivitiesProviderProps) {
  
  const main: AppActivity | undefined = isdef(currentActivity) ? {
    type: 'main',
    name: currentActivity,
    modals: [],
    popovers: [],
  } : undefined
  
  const [activities, setActivities] = useState<AppActivities>({
    main,
    global: {
      type: 'global',
      name: '',
      modals: [],
      popovers: [],
    },
  })
  
  
  return (
    <AppActivitiesContext value={activities}>
      {children}
    </AppActivitiesContext>
  )
}

