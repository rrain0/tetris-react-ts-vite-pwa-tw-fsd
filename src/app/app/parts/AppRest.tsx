import Flex from '@libs/fast-elems/Flex.tsx'
import { useState } from 'react'
import * as React from 'react'
import TetrisGlass from '@features/TetrisGlass/TetrisGlass.tsx'



export default function AppRest() {
  
  const [cnt, setCnt] = useState(0)
  
  return (
    <>
      <Flex col>
        
        <button onClick={() => setCnt(curr => curr + 1)}>Button</button>
        
        <TetrisGlass/>
      
      </Flex>
    </>
  )
}
