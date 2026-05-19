import '@/app/styles/app.css'
import AppActivitiesProvider from '@@/lib/app/activity-manager/providers/AppActivitiesProvider.tsx'
import AppActivity from '@@/lib/app/activity-manager/ui/AppActivity.tsx'
import InputManagerProvider from '@@/lib/app/input-manager/providers/InputManagerProvider.tsx'
import HtmlFullscreenProvider
  from '@@/lib/environment/fullscreen-manager/ui/HtmlFullscreenProvider.tsx'
import GamepadInputProvider
  from '@@/lib/input/gamepad-input/provider/providers/GamepadInputProvider.tsx'
import InputLayoutProvider from '@/entities/input-layout/providers/InputLayoutProvider.tsx'
import PageLifecycleProvider from '@@/lib/environment/page-lifecycle/ui/PageLifecycleProvider.tsx'
import { parserTest } from '@@/lib/parser/model/parser.ts'
import { useState } from 'react'
import * as React from 'react'
import IngameScreen from '@/screens/ingame/ui/IngameScreen.tsx'
import SwUpdater from '@/features/sw-updater/ui/SwUpdater'

parserTest()

export default function App() {
  
  const [activity, setActivity] = useState('Ingame')
  
  return (
    <PageLifecycleProvider>
      <GamepadInputProvider>
        <InputLayoutProvider>
          <HtmlFullscreenProvider navUiShow resumeByGesture>
            
            <SwUpdater/>
            
            <InputManagerProvider>
              <AppActivitiesProvider currentActivity={activity}>
                
                <AppActivity name='Ingame'>
                  <IngameScreen/>
                </AppActivity>
              
              </AppActivitiesProvider>
            </InputManagerProvider>
          
          </HtmlFullscreenProvider>
        </InputLayoutProvider>
      </GamepadInputProvider>
    </PageLifecycleProvider>
  )
}
