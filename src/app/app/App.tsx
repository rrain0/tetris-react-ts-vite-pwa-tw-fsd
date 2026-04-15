import '@/app/styles/app.css'
import AppActivitiesProvider from '@@/lib/activity-manager/ui/AppActivitiesProvider.tsx'
import AppActivity from '@@/lib/activity-manager/ui/AppActivity.tsx'
import FullscreenProvider from '@@/lib/fullscreen-manager/ui/FullscreenProvider.tsx'
import GamepadInputProvider
  from '@@/lib/gamepad-input/gamepad-input/providers/GamepadInputProvider.tsx'
import InputLayoutProvider from '@/entities/input-layout/providers/InputLayoutProvider.tsx'
import PageLifecycleProvider from '@@/lib/page-lifecycle/ui/PageLifecycleProvider.tsx'
import { useState } from 'react'
import * as React from 'react'
import IngameScreen from '@/screens/ingame/ui/IngameScreen.tsx'



export default function App() {
  
  const [activity, setActivity] = useState('Ingame')
  
  return (
    <PageLifecycleProvider>
      <GamepadInputProvider>
        <InputLayoutProvider>
          <FullscreenProvider navUiShow resumeByConfirmation>
            
            <AppActivitiesProvider currentActivity={activity}>
              
              <AppActivity name='Ingame'>
                <IngameScreen/>
              </AppActivity>
              
            </AppActivitiesProvider>
          
          </FullscreenProvider>
        </InputLayoutProvider>
      </GamepadInputProvider>
    </PageLifecycleProvider>
  )
}
