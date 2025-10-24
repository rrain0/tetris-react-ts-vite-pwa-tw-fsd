import 'src/styles/app/reset.css'
import 'src/styles/app/fonts.css'
import 'src/styles/app/app.css'
import Flex from '@utils/libs/fast-elems/Flex.tsx'
import { useState } from 'react'
import * as React from 'react'
import TetrisGlass from 'src/components/components/TetrisGlass/TetrisGlass.tsx'



function App() {
  
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
export default App


