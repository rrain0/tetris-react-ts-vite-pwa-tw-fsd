import { array } from '@utils/base/array/arrayCreateUtils.ts'
import Grid from '@utils/libs/fast-elems/components/Grid.tsx'
import * as React from 'react'
import { type UiBlockInGlass, uiBlockTypeToSrc } from 'src/models/uiBlock.ts'



// TODO loading screen to save images to RAM (dataUrl)

// TODO Figures: TetraJ TetraL TetraI TetraO TetraT TetraS TetraZ

const TetrisGlass = React.memo(() => {
  
  const blocks: UiBlockInGlass[][] =
    array(20 /*rows*/).map(() => array(10 /*cols*/, ''))
  
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
  
  return (
    <Grid w={300} h='ct' css={glassStyle}
      rows='repeat(20, 1fr)' cols='repeat(10, 1fr)'
    >
      {blocks.map((r, ri) => r.map((it, ci) => {
        const src = uiBlockTypeToSrc(it)
        if (!src) return undefined
        return (
          <img key={`${ri} ${ci}`} css={blockStyle} src={src}
            style={{ gridArea: `${ri + 1} / ${ci + 1}` }}
          />
        )
      }))}
    </Grid>
  )
})
TetrisGlass.displayName = 'TetrisGlass'
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
