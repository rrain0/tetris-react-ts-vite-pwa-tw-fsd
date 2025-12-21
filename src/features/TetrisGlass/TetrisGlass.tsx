import { array } from '@utils/array/arrayCreate.ts'
import type { Producer } from '@utils/ts/tsBase.ts'
import Grid from '@libs/fast-elems/Grid.tsx'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { mapBlockUiTypeToSrc } from '@entities/block/lib/blockUi.ts'
import type { BlockUiType } from '@entities/block/model/blockUi.ts'


const newEmptyGlass: Producer<BlockUiType[][]> = () => (
  array(20 /*rows*/).map(() => array(10 /*cols*/, ''))
)

// TODO loading screen to save images to RAM (dataUrl)

// TODO Figures: TetraJ TetraL TetraI TetraO TetraT TetraS TetraZ

function TetrisGlass() {
  
  if (true) {
  
  }
  
  const [blocks, setBlocks] = useState(newEmptyGlass)
  
  const [state, setState] = useState(1)
  
  
  useEffect(() => {
    if (state === 1) {
      const blocks = newEmptyGlass()
      
      // TetraJ
      blocks[18][4] = 'blue'
      blocks[19][4] = 'blue'
      blocks[19][5] = 'blue'
      blocks[19][6] = 'blue'
      
      // TetraL
      blocks[14][7] = 'orange'
      blocks[15][7] = 'orange'
      blocks[16][7] = 'orange'
      blocks[16][8] = 'orange'
      
      // TetraI
      blocks[16][0] = 'red'
      blocks[17][0] = 'red'
      blocks[18][0] = 'red'
      blocks[19][0] = 'red'
      
      // TetraO
      blocks[18][7] = 'yellow'
      blocks[18][8] = 'yellow'
      blocks[19][7] = 'yellow'
      blocks[19][8] = 'yellow'
      
      // TetraT
      blocks[16][9] = 'lightBlue'
      blocks[17][8] = 'lightBlue'
      blocks[17][9] = 'lightBlue'
      blocks[18][9] = 'lightBlue'
      
      // TetraS
      blocks[15][3] = 'violet'
      blocks[16][3] = 'violet'
      blocks[16][4] = 'violet'
      blocks[17][4] = 'violet'
      
      // TetraZ
      blocks[18][1] = 'green'
      blocks[18][2] = 'green'
      blocks[19][2] = 'green'
      blocks[19][3] = 'green'
      
      setBlocks(blocks)
    }
    else setBlocks(newEmptyGlass())
  }, [state])
  
  return (
    <Grid w={300} h='ct' css={glassStyle}
      rows='repeat(20, 1fr)' cols='repeat(10, 1fr)'
    >
      {blocks.map((r, ri) => r.map((it, ci) => {
        const src = mapBlockUiTypeToSrc(it)
        if (!src) return undefined
        return (
          <img key={`${ri} ${ci}`} css={blockStyle} src={src}
            style={{ gridArea: `${ri + 1} / ${ci + 1}` }}
          />
        )
      }))}
    </Grid>
  )
}
export default TetrisGlass



const glassStyle = {
  border: '3px solid',
  borderColor: '#808080',
  borderRadius: '4px',
}
const blockStyle = {
  width: '100%',
  height: 'auto',
  aspectRatio: '1',
  objectPosition: 'center',
  objectFit: 'cover',
}
