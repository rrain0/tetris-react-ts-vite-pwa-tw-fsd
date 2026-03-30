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
  
  // 1.0 - block size
  const totalW = 0.1 + 10 * 1.0 + 0.1 + 6 * 1.0
  const bdWPerc = 0.1 / totalW * 100
  const fieldWPerc = 10 * 1.0 / totalW * 100
  const sideWPerc = 6 * 1.0 / totalW * 100
  const sidePPerc = 0.5 * 1.0 / totalW * 100
  const sideGPerc = 0.25 * 1.0 / totalW * 100
  const nextWPerc = 5 * 1.0 / totalW * 100
  const titleSzPerc = 0.7 * 1.0 / totalW * 100
  const digitsSzPerc = 0.9 * 1.0 / totalW * 100
  
  const titleSzSt = { fontSize: `${titleSzPerc}cqw` }
  const digitsSt = { fontSize: `${digitsSzPerc}cqw` }
  
  return (
    <>
      <div cn='flex row-stretch w-full container-inline-size'
        {...combineProps(
          onKeyboardKeyHold, onKeyboardKeyDownClick,
        )}
      >
        
        <div cn='flex col w-full bd-c-[#808080] rad-[1.25cqw]'
          st={{ borderWidth: `${bdWPerc}cqw` }}
        >
          <TetrisField st={{ width: `${fieldWPerc}cqw` }}
            field={field}
            tabIndex={-1}
            {...focusOnMount}
          />
        </div>
        
        <div cn='flex col' st={{ width: `${sideWPerc}cqw` }}>
          <div cn='flex col h-full' st={{ padding: `${sidePPerc}cqw`, gap: `${sideGPerc}cqw` }}>
            
            <div st={titleSzSt}>
              NEXT
            </div>
            <div cn='flex col-end'>
              <TetrisField st={{ width: `${nextWPerc}cqw` }}
                field={nextField}
              />
            </div>
            
            <div st={titleSzSt}>
              HI-SCORE
            </div>
            <div cn='flex col-end'>
              <div cn={digitsTw} st={digitsSt}>194638</div>
            </div>
            
            <div st={titleSzSt}>
              SCORE
            </div>
            <div cn='flex col-end'>
              <div cn={digitsTw} st={digitsSt}>1666</div>
            </div>
            
            <div st={titleSzSt}>
              LEVEL
            </div>
            <div cn='flex col-end'>
              <div cn={digitsTw} st={digitsSt}>12</div>
            </div>
            
            <div st={titleSzSt}>
              LINES
            </div>
            <div cn='flex col-end'>
              <div cn={digitsTw} st={digitsSt}>57</div>
            </div>
            
            <div cn='flex col end grow'>
              <div cn='flex row center-end p-[4] g-[4] color-[#808080]'>
                <div cn='flex col center sz-[24]'>
                  <FullscreenIc cn='sz-full svg-curr-color'/>
                </div>
                <div cn='flex col center sz-[24] p-[1]'>
                  <PauseIc cn='sz-full svg-curr-color'/>
                </div>
              </div>
            </div>
          
          </div>
        </div>
      
      </div>
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
