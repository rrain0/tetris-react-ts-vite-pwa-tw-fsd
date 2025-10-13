import 'src/styles/app/reset.css'
import 'src/styles/app/fonts.css'
import 'src/styles/app/app.css'
import Flex from '@utils/libs/fast-elems/components/Flex.tsx'
import * as React from 'react'
import TetrisGlass from 'src/components/components/TetrisGlass/TetrisGlass.tsx'



const App = () => {
  
  
  return (
    <>
      <Flex col>
        
        <div
          style={{
            cursor: 'var(--cursor)',
            '--aa': 'aa',
            touchAction: 'none',
          }}
          css={{
            '--aa': 'aa',
            touchAction: 'none',
            cursor: 'var(--cursor)',
          }}
        >
          Test
        </div>
        
        <TetrisGlass/>
        
      </Flex>
    </>
  )
}
App.displayName = 'App'
export default App


