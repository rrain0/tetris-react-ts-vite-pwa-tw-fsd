import { useState } from 'react'
import * as React from 'react'
import TetrisGlass from '@features/TetrisField/TetrisField.tsx'



export default function AppRest() {
  
  const [cnt, setCnt] = useState(0)
  
  return (
    <>
      <div className='flex col'>
        
        <button onClick={() => setCnt(curr => curr + 1)}>Button</button>
        
        <TetrisGlass/>
      
      </div>
    </>
  )
}
