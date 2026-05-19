


export interface AppActivities {
  main: AppActivity | undefined
  global: AppActivity | undefined
}

/*
 'global' - just container for global modals & popovers.
 'main' - page / screen. Only last one of type is displayed.
 'modal' - some widget requiring action and blocks interactions with other elements.
 'popover' - some widget that not blocks interaction with other elements.
 */
export type AppActivityType = 'global' | 'main' | 'modal' | 'popover'

export interface AppActivity {
  type: AppActivityType
  name: string
  modals: AppActivity[]
  popovers: AppActivity[]
}



export interface AppActivityState {
  name: string
  rendered: boolean
}
