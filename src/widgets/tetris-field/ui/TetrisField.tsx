import { AppActivityContext } from '@lib/activity-manager/context/AppActivityContext.ts'
import { useGamepadKeyHold } from '@lib/gamepad-input-events/gamepad-key-hold/useGamepadKeyHold.ts'
import {
  useGamepadDownClick
} from '@lib/gamepad-input-events/gamepad-down-click/useGamepadDownClick.ts'
import type { Field } from '@lib/tetris-engine/entities/field/model/field.ts'
import { Game } from '@lib/tetris-engine/entities/game/model/game.ts'
import { useKeyDownClick } from '@lib/native-button-events/useKeyDownClick.ts'
import { useKeyHold } from '@lib/native-button-events/useKeyHold.ts'
import { combineProps } from '@utils/react/props/combineProps.ts'
import type { Setter } from '@utils/ts/ts.ts'
import { InputLayoutContext } from 'entities/input-layout/context/InputLayoutContext.ts'
import { isGamepadKeyAction } from 'entities/input-layout/model/isGamepadKeyAction.ts'
import { isKeyboardAction } from 'entities/input-layout/model/isKeyboardAction.ts'
import { use, useState } from 'react'
import Block from '@widgets/tetris-field/entities/block/ui/Block.tsx'
import {
  newISrs, newJSrs, newLSrs, newOSrs, newSSrs, newTSrs, newZSrs,
} from '@lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { mapPieceTypeToBlockUiType } from '@widgets/tetris-field/entities/block/lib/blockUi.ts'




// TODO loading screen to save images to RAM (dataUrl)


const game = new Game()
//game.current = newOSrs(undefined)
game.current.xy = [4, 5]
game.field.addPiece(newTSrs(undefined, [0, 14]).toRotatedRight().next().value!.toRotatedRight().next().value!)
game.field.addPiece(newISrs(undefined, [-3, 15]).toRotatedRight().next().value!)
game.field.addPiece(newZSrs(undefined, [1, 18]))
game.field.addPiece(newSSrs(undefined, [3, 15]).toRotatedLeft().next().value!)
game.field.addPiece(newJSrs(undefined, [4, 18]))
game.field.addPiece(newLSrs(undefined, [6, 14]).toRotatedRight().next().value!)
game.field.addPiece(newOSrs(undefined, [6, 18]))
game.field.addPiece(newTSrs(undefined, [8, 16]).toRotatedLeft().next().value!)



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
  
  
  
  const [field, setField] = useState(() => game.renderField())
  
  
  
  const focusOnMount = { ref: (elem: HTMLElement | null) => elem?.focus() }
  
  
  const { onKeyboardKeyHold, onKeyboardKeyDownClick } = useAppActions(setField)
  
  return (
    <div
      // in-focus:bg-[yellow]
      className={`
        grid w-full h-ct
        rows-[repeat(20,1fr)] cols-[repeat(10,1fr)]
        
        ${fieldStyle}
      `}
      {...combineProps(
        { tabIndex: -1 }, focusOnMount,
        onKeyboardKeyHold, onKeyboardKeyDownClick,
      )}
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



function useAppActions(setField: Setter<Field>) {
  const { inputLayout } = use(InputLayoutContext)
  
  const onKeyboardKeyHold = useKeyHold({ interval: 150 }, ev => {
    if (isKeyboardAction('ingame', 'moveLeft', ev, inputLayout)) {
      game.moveCurrentPieceLeft()
      setField(game.renderField())
    }
    if (isKeyboardAction('ingame', 'moveRight', ev, inputLayout)) {
      game.moveCurrentPieceRight()
      setField(game.renderField())
    }
    if (isKeyboardAction('ingame', 'moveDown', ev, inputLayout)) {
      game.moveCurrentPieceDown()
      setField(game.renderField())
    }
    if (isKeyboardAction('ingame', 'moveUp', ev, inputLayout)) {
      game.moveCurrentPieceUp()
      setField(game.renderField())
    }
  })
  
  const onKeyboardKeyDownClick = useKeyDownClick(ev => {
    if (isKeyboardAction('ingame', 'rotateLeft', ev, inputLayout)) {
      game.rotateCurrentPieceLeft()
      setField(game.renderField())
    }
    if (isKeyboardAction('ingame', 'rotateRight', ev, inputLayout)) {
      game.rotateCurrentPieceRight()
      setField(game.renderField())
    }
    if (isKeyboardAction('ingame', 'hardDrop', ev, inputLayout)) {
      game.dropCurrentPiece()
      setField(game.renderField())
    }
  })
  
  
  useGamepadKeyHold({ interval: 150 }, ev => {
    if (isGamepadKeyAction('ingame', 'moveLeft', ev, inputLayout)) {
      game.moveCurrentPieceLeft()
      setField(game.renderField())
    }
    if (isGamepadKeyAction('ingame', 'moveRight', ev, inputLayout)) {
      game.moveCurrentPieceRight()
      setField(game.renderField())
    }
    if (isGamepadKeyAction('ingame', 'moveDown', ev, inputLayout)) {
      game.moveCurrentPieceDown()
      setField(game.renderField())
    }
    if (isGamepadKeyAction('ingame', 'moveUp', ev, inputLayout)) {
      game.moveCurrentPieceUp()
      setField(game.renderField())
    }
  })
  
  useGamepadDownClick(ev => {
    if (isGamepadKeyAction('ingame', 'rotateLeft', ev, inputLayout)) {
      game.rotateCurrentPieceLeft()
      setField(game.renderField())
    }
    if (isGamepadKeyAction('ingame', 'rotateRight', ev, inputLayout)) {
      game.rotateCurrentPieceRight()
      setField(game.renderField())
    }
    if (isGamepadKeyAction('ingame', 'hardDrop', ev, inputLayout)) {
      game.dropCurrentPiece()
      setField(game.renderField())
    }
  })
  
  return { onKeyboardKeyHold, onKeyboardKeyDownClick }
}
