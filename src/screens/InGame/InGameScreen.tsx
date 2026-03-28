import * as React from 'react'
import TetrisGlass from '@widgets/tetris-field/ui/TetrisField.tsx'
import FullscreenIc from '@assets/ic/svg/ui/fullscreen.svg?react'



export default function InGameScreen() {
  
  return (
    <>
      <div className='flex col'>
        
        <div className='flex row justify-end p-[4]'>
          <FullscreenIc className='sz-[20] svg-color-[white]'/>
          <div>Pause</div>
        </div>
        
        <TetrisGlass/>
      
      </div>
    </>
  )
}
