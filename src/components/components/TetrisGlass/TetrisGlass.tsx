import { array } from '@utils/base/array/arrayCreateUtils.ts'
import Grid from '@utils/libs/fast-elems/components/Grid.tsx'
import * as React from 'react'
import { type UiBlockInGlass, uiBlockTypeToSrc } from 'src/models/uiBlock.ts'



// TODO loading screen to save images to RAM (dataUrl)

// TODO Figures: TetraJ TetraL TetraI TetraO TetraT TetraS TetraZ

const TetrisGlass = React.memo(() => {
  
  const blocks: UiBlockInGlass[][] =
    array(20 /*rows*/).map(() => array(10 /*cols*/, ''))
  
  blocks[18][4] = 'blue'
  blocks[19][4] = 'blue'
  blocks[19][5] = 'blue'
  blocks[19][6] = 'blue'
  
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
