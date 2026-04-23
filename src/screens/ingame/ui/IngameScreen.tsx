import { ingameScreenPortSizes } from '@/screens/ingame/ui/port/ingameScreenPortSizes.ts'
import { AppActivityContext } from '@@/lib/app/activity-manager/context/AppActivityContext.ts'
import { InputManagerContext } from '@@/lib/app/input-manager/context/InputManagerContext.ts'
import {
  useGamepadDownClick
} from '@@/lib/input/gamepad-key/useGamepadDownClick.ts'
import {
  useGamepadKeyHold,
} from '@@/lib/input/gamepad-key/useGamepadKeyHold.ts'
import { useKeyDownClick } from '@@/lib/input/key/useKeyDownClick.ts'
import { useKeyHold } from '@@/lib/input/key/useKeyHold.ts'
import useLockSelection from '@@/lib/input/pointer/useLockSelection.ts'
import { usePointer } from '@@/lib/input/pointer/usePointer.ts'
import { usePointersData } from '@@/lib/input/pointer/usePointersData.ts'
import { Game } from '@@/lib/tetris/tetris-engine/entities/game/model/game.ts'
import {
  newISrs, newJSrs, newLSrs, newOSrs, newSSrs, newTSrs, newZSrs,
} from '@@/lib/tetris/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { elemProps } from '@@/utils/elem/elemProps.ts'
import { useFocusWithinElem } from '@@/utils/elem/useFocusWithinElem.ts'
import { useResizeRef } from '@@/utils/elem/useResizeRef.ts'
import { floorTo0 } from '@@/utils/math/rounding.ts'
import { propsOf } from '@@/utils/react/props/combineProps.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { assertNever, type Setter } from '@@/utils/ts/ts.ts'
import { InputLayoutContext } from '@/entities/input-layout/context/InputLayoutContext.ts'
import { isGamepadKeyAction } from '@/entities/input-layout/model/isGamepadKeyAction.ts'
import { isKeyboardAction } from '@/entities/input-layout/model/isKeyboardAction.ts'
import React, { use, useLayoutEffect, useState } from 'react'
import { ingameScreenLandSmSizes } from '@/screens/ingame/ui/land-sm/ingameScreenLandSmSizes.ts'
import IngameScreenLand from '@/screens/ingame/ui/land/IngameScreenLand.tsx'
import IngameScreenLandSm from '@/screens/ingame/ui/land-sm/IngameScreenLandSm.tsx'
import { ingameScreenLandSizes } from '@/screens/ingame/ui/land/ingameScreenLandSizes.ts'
import IngameScreenPort from '@/screens/ingame/ui/port/IngameScreenPort.tsx'
import PageFullVp from '@@/components/elems/PageFullVp.tsx'
import bg from '@@/assets/im/bg4.jpg'
import type { IngameData } from '@/screens/ingame/model/ingameScreen.model.ts'
import * as uuid from 'uuid'





const game = (() => {
  const game = new Game()
  game.tetris.current!.x = 4
  game.tetris.current!.y = 5
  game.tetris.field.addPiece(newTSrs({ x: 0, y: 14 }).toRotatedRight().next().value!
    .toRotatedRight().next().value!
  )
  game.tetris.field.addPiece(newISrs({ x: -3, y: 15 }).toRotatedRight().next().value!)
  game.tetris.field.addPiece(newZSrs({ x: 1, y: 18 }))
  game.tetris.field.addPiece(newSSrs({ x: 3, y: 15 }).toRotatedLeft().next().value!)
  game.tetris.field.addPiece(newJSrs({ x: 4, y: 18 }))
  game.tetris.field.addPiece(newLSrs({ x: 6, y: 14 }).toRotatedRight().next().value!)
  game.tetris.field.addPiece(newOSrs({ x: 6, y: 18 }))
  game.tetris.field.addPiece(newTSrs({ x: 8, y: 16 }).toRotatedLeft().next().value!)
  return game
})()
const getIngameData = () => gameToIngameData(game)





export default function IngameScreen() {
  const [ingameData, setIngameData] = useState<IngameData>(getIngameData)
  
  
  const [layout, setLayout] = useState<Layout>(undefined)
  const [getWh, setWh] = useRefGetSet({ w: 0, h: 0 })
  
  const portSizes = ingameScreenPortSizes()
  const landSmSizes = ingameScreenLandSmSizes()
  const landSizes = ingameScreenLandSizes()
  
  const refFun = useResizeRef(elem => {
    if (!elem) setLayout(undefined)
    else {
      const { ratio, wh } = elemProps(elem)
      //console.log('wh', wh, 'ratio', ratio)
      setWh(wh)
      if (ratio >= landSizes.gameRatio) setLayout('land')
      else if (ratio >= landSmSizes.gameRatio) setLayout('landSm')
      else setLayout('port')
    }
  })
  
  const { interactive } = use(AppActivityContext)
  
  const canUseInput = ({ key, mx, my }: {
    key?: string | undefined
    mx?: boolean | undefined
    my?: boolean | undefined
  }) => {
    if (!interactive) return false
    return true
  }
  
  const refToFocus = useFocusWithinElem()
  
  const { onKeyboardKeyHold, onKeyboardKeyDownClick } = useAppActions({ game, setIngameData })
  
  const [lockSelection, unlockSelection] = useLockSelection()
  
  
  const [getDPos, setDPos] = usePointersData<{ dCol: number, dRot: number }>()
  
  
  const inputId = uuid.v4()
  const { tryLock, unlock, allow } = use(InputManagerContext)
  
  useLayoutEffect(() => {
    const onPointer = (ev: PointerEvent) => {
      unlock(inputId, `pointer[${ev.pointerId}]`)
    }
    window.addEventListener('pointercancel', onPointer)
    window.addEventListener('pointerup', onPointer)
    return () => {
      window.removeEventListener('pointercancel', onPointer)
      window.removeEventListener('pointerup', onPointer)
    }
  })
  
  const onPointer = usePointer((move, upd) => {
    const { ev, start, wasStart, first, last, move: m, vp0, vp, pointerId } = move
    if (wasStart) {
      if (first) {
        if (!tryLock(inputId, `pointer[${pointerId}]`)) {
          upd({ wasStart: false })
          return
        }
        ev.currentTarget.setPointerCapture(pointerId)
        lockSelection()
      }
      
      if (layout) {
        const blockSz = (() => {
          if (layout === 'land') return landSizes.wOfH(landSizes.blockSz, getWh().h)
          if (layout === 'landSm') return landSmSizes.wOfH(landSizes.blockSz, getWh().h)
          if (layout === 'port') return portSizes.hOfW(landSizes.blockSz, getWh().w)
          assertNever(layout)
        })()
        
        const prev = getDPos(pointerId) ?? { dCol: 0, dRot: 0 }
        const dCol = floorTo0(m.x / blockSz)
        const dRot = floorTo0(m.y / blockSz)
        for (let d = prev.dCol + 1; d <= dCol; d++) {
          game.tetris.moveCurrentPieceRight()
        }
        for (let d = prev.dCol - 1; d >= dCol; d--) {
          game.tetris.moveCurrentPieceLeft()
        }
        for (let d = prev.dRot + 1; d <= dRot; d++) {
          game.tetris.rotateCurrentPieceRight()
        }
        for (let d = prev.dRot - 1; d >= dRot; d--) {
          game.tetris.rotateCurrentPieceLeft()
        }
        setDPos(pointerId, { dCol, dRot })
        
        setIngameData(gameToIngameData(game))
      }
      
      if (last) {
        setDPos(pointerId, undefined)
        unlock(inputId, `pointer[${ev.pointerId}]`)
        unlockSelection()
      }
    }
  })
  
  
  return (
    <>
      <PageFullVp cn='p-[8] bg-pos-[center] bg-sz-[cover] no-touch-action'
        st={{ backgroundImage: `url(${bg})` }}
        ref={refToFocus}
        tabIndex={-1}
        {...propsOf(onKeyboardKeyHold, onKeyboardKeyDownClick, onPointer())}
      >
        <div cn='sz-full stack center2 container-size' ref={refFun}>
          <ScreenLayout layout={layout} {...ingameData}/>
        </div>
      </PageFullVp>
    </>
  )
}



type Layout = 'land' | 'landSm' | 'port' | undefined

function ScreenLayout(props: IngameData & { layout: Layout }) {
  const { layout, tetris, ...stats } = props
  return (
    <>
      {layout === 'land' && (
        <IngameScreenLand
          field={tetris.renderField()}
          nextField={tetris.renderNextField()}
          {...stats}
        />
      )}
      {layout === 'landSm' && (
        <IngameScreenLandSm
          field={tetris.renderField()}
          nextField={tetris.renderNextField()}
          {...stats}
        />
      )}
      {layout === 'port' && (
        <IngameScreenPort
          combinedField={tetris.renderCombinedField()}
          isCurrentPieceAboveField={tetris.isCurrentPieceAboveField}
          {...stats}
        />
      )}
    </>
  )
}



type UseAppActionParams = {
  game: Game,
  setIngameData: Setter<IngameData>,
}

function useAppActions(params: UseAppActionParams) {
  const { inputLayout } = use(InputLayoutContext)
  
  const onKeyboardKeyHold = useKeyHold({ interval: 150 }, ev => {
    if (isKeyboardAction('ingame', 'moveLeft', ev, inputLayout)) {
      moveLeft(params)
    }
    if (isKeyboardAction('ingame', 'moveRight', ev, inputLayout)) {
      moveRight(params)
    }
    if (isKeyboardAction('ingame', 'moveDown', ev, inputLayout)) {
      moveDown(params)
    }
    if (isKeyboardAction('ingame', 'moveUp', ev, inputLayout)) {
      moveUp(params)
    }
  })
  
  const onKeyboardKeyDownClick = useKeyDownClick(ev => {
    if (isKeyboardAction('ingame', 'rotateLeft', ev, inputLayout)) {
      rotateLeft(params)
    }
    if (isKeyboardAction('ingame', 'rotateRight', ev, inputLayout)) {
      rotateRight(params)
    }
    if (isKeyboardAction('ingame', 'hardDrop', ev, inputLayout)) {
      hardDrop(params)
    }
  })
  
  
  useGamepadKeyHold({ interval: 150 }, ev => {
    if (isGamepadKeyAction('ingame', 'moveLeft', ev, inputLayout)) {
      moveLeft(params)
    }
    if (isGamepadKeyAction('ingame', 'moveRight', ev, inputLayout)) {
      moveRight(params)
    }
    if (isGamepadKeyAction('ingame', 'moveDown', ev, inputLayout)) {
      moveDown(params)
    }
    if (isGamepadKeyAction('ingame', 'moveUp', ev, inputLayout)) {
      moveUp(params)
    }
  })
  
  useGamepadDownClick(ev => {
    if (isGamepadKeyAction('ingame', 'rotateLeft', ev, inputLayout)) {
      rotateLeft(params)
    }
    if (isGamepadKeyAction('ingame', 'rotateRight', ev, inputLayout)) {
      rotateRight(params)
    }
    if (isGamepadKeyAction('ingame', 'hardDrop', ev, inputLayout)) {
      hardDrop(params)
    }
  })
  
  return { onKeyboardKeyHold, onKeyboardKeyDownClick }
}



function moveLeft({ game, setIngameData }: UseAppActionParams) {
  game.tetris.moveCurrentPieceLeft()
  setIngameData(gameToIngameData(game))
}
function moveRight({ game, setIngameData }: UseAppActionParams) {
  game.tetris.moveCurrentPieceRight()
  setIngameData(gameToIngameData(game))
}
function moveDown({ game, setIngameData }: UseAppActionParams) {
  game.tetris.moveCurrentPieceDown()
  setIngameData(gameToIngameData(game))
}
function moveUp({ game, setIngameData }: UseAppActionParams) {
  game.tetris.moveCurrentPieceUp()
  setIngameData(gameToIngameData(game))
}
function rotateLeft({ game, setIngameData }: UseAppActionParams) {
  game.tetris.rotateCurrentPieceLeft()
  setIngameData(gameToIngameData(game))
}
function rotateRight({ game, setIngameData }: UseAppActionParams) {
  game.tetris.rotateCurrentPieceRight()
  setIngameData(gameToIngameData(game))
}
function hardDrop({ game, setIngameData }: UseAppActionParams) {
  game.tetris.dropCurrentPiece()
  game.tetris.lockCurrentPiece()
  const lines = game.tetris.getFullLines()
  game.tetris.clearLines(lines)
  game.tetris.dropLines(lines)
  game.tetris.spawnNewPieceOrGameOver()
  setIngameData(gameToIngameData(game))
}



function gameToIngameData(game: Game): IngameData {
  const { hiScore, score, level, lines, tetris } = game
  return { hiScore, score, level, lines, tetris: tetris.copy() }
}