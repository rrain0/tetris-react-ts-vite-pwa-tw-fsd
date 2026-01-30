import { AppActivityContext } from '@lib/activity-manager/context/AppActivityContext.ts'
import { useKeyClick } from '@utils/events/useKeyClick.ts'
import { useKeyHold } from '@utils/events/useKeyHold.ts'
import { combineProps } from '@utils/react/props/combineProps.ts'
import { use } from 'react'
import Block from '@widgets/tetris-field/entities/block/ui/Block.tsx'
import { Field } from '@lib/tetris-engine/entities/field/model/field.ts'
import {
  newISrs, newJSrs, newLSrs, newOSrs, newSSrs, newTSrs, newZSrs,
} from '@lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { mapPieceTypeToBlockUiType } from '@widgets/tetris-field/entities/block/lib/blockUi.ts'


// TODO loading screen to save images to RAM (dataUrl)


const field = new Field()
field.addPiece(newOSrs(undefined, [4, 5]))
field.addPiece(newTSrs(undefined, [0, 14]).toRotated(2))
field.addPiece(newISrs(undefined, [-2, 15]).toRotated(1))
field.addPiece(newZSrs(undefined, [1, 18]))
field.addPiece(newSSrs(undefined, [3, 15]).toRotated(-1))
field.addPiece(newJSrs(undefined, [4, 18]))
field.addPiece(newLSrs(undefined, [6, 14]).toRotated(1))
field.addPiece(newOSrs(undefined, [6, 18]))
field.addPiece(newTSrs(undefined, [8, 16]).toRotated(-1))



export default function TetrisField() {
  
  const { interactive } = use(AppActivityContext)
  
  const canUseInput = ({ key, mx, my }: {
    key?: string | undefined
    mx?: boolean | undefined
    my?: boolean | undefined
  }) => {
    if (!interactive) return false
    return true
  }
  
  const onKeyHold = useKeyHold({ interval: 350 }, ev => {
    console.log('keyhold', ev)
  })
  const onKeyClick = useKeyClick(ev => {
    console.log('keyclick', ev)
  })
  
  
  
  
  return (
    <div
      className={`
        grid w-[300] h-ct
        rows-[repeat(20,1fr)] cols-[repeat(10,1fr)]
        in-focus:bg-[yellow]
        ${fieldStyle}
      `}
      //tabIndex={-1}
      //onClick={ev => { console.log('click', ev) }}
      /* onKeyDown={ev => {
        console.log('keyDown', ev.code, ev.key, ev)
      }}
      onKeyUp={ev => {
        console.log('keyUp', ev.code, ev.key, ev)
      }} */
      {...combineProps(onKeyClick, onKeyHold, {
      })}
      //onFocus={ev => { console.log('container focus') }}
      //onBlur={ev => { console.log('container blur') }}
    >
      {[...field].map(({ x, y, block }) => {
        if (!block) return
        const type = mapPieceTypeToBlockUiType(block.type)
        if (!type) return
        const ri = y + 1
        const ci = x + 1
        return (
          <Block type={type}
            key={`${ri} ${ci}`}
            style={{ gridArea: `${ri} / ${ci}` }}
            onFocus={ev => { console.log('block focus') }}
            onBlur={ev => { console.log('block blur') }}
          />
        )
      })}
    </div>
  )
}



const fieldStyle = 'border-[3px] border-solid border-[#808080] rounded-[4px]'
