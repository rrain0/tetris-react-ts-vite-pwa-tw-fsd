import * as React from 'react'
import TetrisGlass from '@widgets/tetris-field/ui/TetrisField.tsx'
import FullscreenIc from '@assets/ic/svg/ui/fullscreen.svg?react'
import PauseIc from '@assets/ic/svg/ui/pause.svg?react'



export default function InGameScreen() {
  
  return (
    <>
      <div className='flex col'>
        
        <div className='flex row center-end p-[4] g-[4] color-[#808080]'>
          Next:
          <div className='flex col center sz-[24]'>
            <FullscreenIc className='sz-full svg-curr-color'/>
          </div>
          <div className='flex col center sz-[24] p-[1]'>
            <PauseIc className='sz-full svg-curr-color'/>
          </div>
        </div>
        
        <TetrisGlass/>
      
      </div>
    </>
  )
}
