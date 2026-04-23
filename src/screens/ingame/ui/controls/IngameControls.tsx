import IngameControlsButton from '@/screens/ingame/ui/controls/IngameControlsButton.tsx'
import {
  FullscreenContext,
} from '@@/lib/environment/fullscreen-manager/context/FullscreenContext.ts'
import { useOnClick } from '@@/lib/input/pointer/useOnClick.ts'
import type { StylePropType } from '@@/utils/react/props/propTypes.ts'
import FullscreenIc from '@@/assets/ic/svg/ui/fullscreen.svg?react'
import WindowedIc from '@@/assets/ic/svg/ui/windowed.svg?react'
import SpinnerTwoQuarterArcsIc from '@@/assets/ic/svg/ui/spinner-two-quarter-arcs.svg?react'
import PauseIc from '@@/assets/ic/svg/ui/pause.svg?react'
import React, { use } from 'react'




// TODO loading screen to save images to RAM (dataUrl)
// TODO ℹ️ Use Modal to ask for fullscreen
// TODO ℹ️ Pause menu can have option to reload & update


export type IngameControlsProps = {
  containerSt: StylePropType
  controlsSt: StylePropType
  controlsIcSt: StylePropType
}

export default function IngameControls(props: IngameControlsProps) {
  const { containerSt, controlsSt, controlsIcSt } = props
  
  const fscreen = use(FullscreenContext)
  
  const onFscreenClick = useOnClick(!fscreen.enabled ? fscreen.enter : fscreen.exit)
  
  const onPause = () => { }
  
  return (
    <div cn='jus-end flex row start-end no-pointer container-size' st={containerSt}>
      <div cn='flex row start-end no-pointer' st={controlsSt}>
        
        {fscreen.available && (
          <IngameControlsButton
            cn={`stack center2 no-pointer ${!fscreen.enabled ? 'fscreen-on' : 'fscreen-off'}`}
            st={controlsIcSt}
            {...onFscreenClick}
          >
            {!fscreen.enabled && <FullscreenIc cn='sz-full'/>}
            {fscreen.enabled && <WindowedIc cn='sz-full'/>}
            {fscreen.needEnter && <SpinnerTwoQuarterArcsIc cn='sz-[30%] ended2 rotation-1s'/>}
          </IngameControlsButton>
        )}
        
        <IngameControlsButton cn='flexrc center2' st={controlsIcSt} onClick={onPause}>
          <PauseIc cn='sz-full'/>
        </IngameControlsButton>
      
      </div>
    </div>
  )
}
