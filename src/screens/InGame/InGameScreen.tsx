import { AppActivityContext } from '@lib/activity-manager/context/AppActivityContext.ts'
import {
  useGamepadDownClick
} from '@lib/gamepad-input-events/gamepad-down-click/useGamepadDownClick.ts'
import { useGamepadKeyHold } from '@lib/gamepad-input-events/gamepad-key-hold/useGamepadKeyHold.ts'
import { useKeyDownClick } from '@lib/native-button-events/useKeyDownClick.ts'
import { useKeyHold } from '@lib/native-button-events/useKeyHold.ts'
import type { Field } from '@lib/tetris-engine/entities/field/model/field.ts'
import { Game } from '@lib/tetris-engine/entities/game/model/game.ts'
import {
  newISrs, newJSrs, newLSrs, newOSrs, newSSrs, newTSrs, newZSrs,
} from '@lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { combineProps } from '@utils/react/props/combineProps.ts'
import type { Setter } from '@utils/ts/ts.ts'
import { InputLayoutContext } from 'entities/input-layout/context/InputLayoutContext.ts'
import { isGamepadKeyAction } from 'entities/input-layout/model/isGamepadKeyAction.ts'
import { isKeyboardAction } from 'entities/input-layout/model/isKeyboardAction.ts'
import { use, useState } from 'react'
import TetrisField from '@widgets/tetris-field/ui/TetrisField.tsx'
import FullscreenIc from '@assets/ic/svg/ui/fullscreen.svg?react'
import PauseIc from '@assets/ic/svg/ui/pause.svg?react'
import PageFullVp from 'shared/components/elems/PageFullVp.tsx'




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




export default function InGameScreen() {
  
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
  const [nextField, setNextField] = useState(() => game.renderNextField())
  
  
  const { onKeyboardKeyHold, onKeyboardKeyDownClick } = useAppActions(setField)
  
  
  const focusOnMount = { ref: (elem: HTMLElement | null) => elem?.focus() }
  
  const bSz = 1.0 // block size
  const p = 0.5 * bSz
  const bdW = 0.1
  const fieldW = 10 * bSz
  const sideW = 6 * bSz
  const sideG = 0.35 * bSz
  const nextW = 4 * bSz
  const titleSz = 0.7 * bSz
  const digitsSz = 0.9 * bSz
  const icSz = 1.3 * bSz
  const icG = 0.3 * bSz
  
  const totalW = bdW + fieldW + bdW + p + sideW
  const cqw = (w: number) => `${w / totalW * 100}cqw`
  
  const titleSt = { fontSize: cqw(titleSz) }
  const digitsSt = { fontSize: cqw(digitsSz) }
  const icSt = { width: cqw(icSz), height: cqw(icSz) }
  
  return (
    <>
      <PageFullVp cn='grid center'>
        <div cn='flex center w-full p-[8]'
          {...combineProps(
            onKeyboardKeyHold, onKeyboardKeyDownClick,
          )}
        >
          
          <div cn='grid row w-full container-inline-size' st={{ gap: cqw(p) }}>
            
            <div cn='flex col w-ct bd-c-[#808080] rad-[1.25cqw]'
              st={{ borderWidth: cqw(bdW) }}
            >
              <TetrisField st={{ width: cqw(fieldW) }}
                field={field}
                tabIndex={-1}
                {...focusOnMount}
              />
            </div>
            
            <div cn='flex col' st={{ width: cqw(sideW) }}>
              <div cn='flex col h-full' st={{ gap: cqw(sideG) }}>
                
                <div st={titleSt}>
                  HI-SCORE
                </div>
                <div cn='flex col-end'>
                  <div cn={digitsTw} st={digitsSt}>194638</div>
                </div>
                
                <div st={titleSt}>
                  SCORE
                </div>
                <div cn='flex col-end'>
                  <div cn={digitsTw} st={digitsSt}>1666</div>
                </div>
                
                <div st={titleSt}>
                  LEVEL
                </div>
                <div cn='flex col-end'>
                  <div cn={digitsTw} st={digitsSt}>12</div>
                </div>
                
                <div st={titleSt}>
                  LINES
                </div>
                <div cn='flex col-end'>
                  <div cn={digitsTw} st={digitsSt}>57</div>
                </div>
                
                <div st={titleSt}>
                  NEXT
                </div>
                <div cn='flex col-end'>
                  <TetrisField st={{ width: cqw(nextW) }}
                    field={nextField}
                  />
                </div>
                
                <div cn='flex col end grow'>
                  <div cn='flex row center-end color-[#282c34]' st={{ gap: cqw(icG) }}>
                    <div cn='flex col center' st={icSt}>
                      <FullscreenIc cn='sz-full svg-curr-color'/>
                    </div>
                    <div cn='flex col center p-[1]' st={icSt}>
                      <PauseIc cn='sz-full svg-curr-color'/>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          
          </div>
        
        </div>
      </PageFullVp>
    </>
  )
}



const digitsTw = 'tx-f-[DSEG7Mod7ClassicMini] tx-wt-[bold] tx-h-[1] tx-sp-[normal]'



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
