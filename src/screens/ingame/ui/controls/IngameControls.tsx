import { FullscreenContext } from '@@/lib/fullscreen-manager/context/FullscreenContext.ts'
import type { StylePropType } from '@@/utils/react/props/propTypes.ts'
import FullscreenIc from '@@/assets/ic/svg/ui/fullscreen.svg?react'
import WindowedIc from '@@/assets/ic/svg/ui/windowed.svg?react'
import SpinnerTwoQuarterArcsIc from '@@/assets/ic/svg/ui/spinner-two-quarter-arcs.svg?react'
import PauseIc from '@@/assets/ic/svg/ui/pause.svg?react'
import { use } from 'react'



export type IngameControlsProps = {
  containerSt: StylePropType
  controlsSt: StylePropType
  controlsIcSt: StylePropType
}

export default function IngameControls(props: IngameControlsProps) {
  const { containerSt, controlsSt, controlsIcSt } = props
  
  const fscreen = use(FullscreenContext)
  
  const onPause = () => { }
  
  return (
    <div cn='jus-end flex row start-end no-pointer container-size' st={containerSt}>
      <div cn='flex row start-end no-pointer' st={controlsSt}>
        {fscreen.available && (
          <div cn='stack center2 no-pointer' st={controlsIcSt}>
            {!fscreen.enabled && <FullscreenIc cn={`sz-full ${icCn}`} onClick={fscreen.enter}/>}
            {fscreen.enabled && <WindowedIc cn={`sz-full ${icCn}`} onClick={fscreen.exit}/>}
            {fscreen.needEnter && (
              <SpinnerTwoQuarterArcsIc
                cn={`sz-[30%] ended2 no-pointer ${icCn} rotation-1s`}
              />
            )}
          </div>
        )}
        <div cn='flexrc center2 no-pointer' st={controlsIcSt}>
          <PauseIc cn={`sz-full ${icCn}`} onClick={onPause}/>
        </div>
      </div>
    </div>
  )
}



// Content styles
const icCn = 'cl-[var(--cl-hud-tx)] svg-curr-cl'
