import '@app/styles/app.css'
import AppActivitiesProvider from '@lib/activity-manager/ui/AppActivitiesProvider.tsx'
import AppActivity from '@lib/activity-manager/ui/AppActivity.tsx'
import GamepadInputProvider
  from '@lib/gamepad-input/gamepad-input/providers/GamepadInputProvider.tsx'
import { useState } from 'react'
import * as React from 'react'
import InGameScreen from 'screens/InGame/InGameScreen.tsx'



export default function App() {
  
  const [activity, setActivity] = useState('InGame')
  
  return (
    <>
      <GamepadInputProvider>
        <AppActivitiesProvider currentActivity={activity}>
          
          <AppActivity name='InGame'>
            <InGameScreen/>
          </AppActivity>
        
        </AppActivitiesProvider>
      </GamepadInputProvider>
    </>
  )
}
