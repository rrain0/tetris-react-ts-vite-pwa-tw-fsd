import { ingameScreenPortSizes } from '@/screens/ingame/ui/port/ingameScreenPortSizes.ts'
import {
  useGamepadDownClick
} from '@@/lib/input/gamepad-key/useGamepadDownClick.ts'
import {
  useGamepadKeyHold,
} from '@@/lib/input/gamepad-key/useGamepadKeyHold.ts'
import { useKeyDownClick } from '@@/lib/input/key/useKeyDownClick.ts'
import { useKeyHold } from '@/_unused/useKeyHold.ts'
import { useKeyStartEnd } from '@@/lib/input/key/useKeyStartEnd.ts'
import { useLockPointerDrag } from '@@/lib/input/shared/useLockPointerDrag.ts'
import useLockSelection from '@@/lib/input/shared/useLockSelection.ts'
import { usePointer } from '@@/lib/input/pointer/usePointer.ts'
import { useRecord } from '@@/utils/react/more/useRecord.ts'
import { Game } from '@@/lib/tetris/game-engine/entities/game/model/game.ts'
import {
  newISrs, newJSrs, newLSrs, newOSrs, newSSrs, newTSrs, newZSrs,
} from '@@/lib/tetris/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { elemProps } from '@@/utils/dom/elemProps.ts'
import { useFocusWithinElem } from '@@/utils/dom/useFocusWithinElem.ts'
import { useResizeRef } from '@@/utils/dom/useResizeRef.ts'
import { floorTo0 } from '@@/utils/math/rounding.ts'
import { propsOf } from '@@/utils/react/props/combineProps.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { assertNever } from '@@/utils/ts/ts.ts'
import { InputLayoutContext } from '@/entities/input-layout/context/InputLayoutContext.ts'
import { isGamepadKeyAction } from '@/entities/input-layout/model/isGamepadKeyAction.ts'
import { isKeyboardAction } from '@/entities/input-layout/model/isKeyboardAction.ts'
import React, { use, useEffect, useState } from 'react'
import { ingameScreenLandSmSizes } from '@/screens/ingame/ui/land-sm/ingameScreenLandSmSizes.ts'
import IngameScreenLand from '@/screens/ingame/ui/land/IngameScreenLand.tsx'
import IngameScreenLandSm from '@/screens/ingame/ui/land-sm/IngameScreenLandSm.tsx'
import { ingameScreenLandSizes } from '@/screens/ingame/ui/land/ingameScreenLandSizes.ts'
import IngameScreenPort from '@/screens/ingame/ui/port/IngameScreenPort.tsx'
import PageFullVp from '@@/components/elems/PageFullVp.tsx'
import bg from '@@/assets/im/bg4.jpg'
import type { IngameData } from '@/screens/ingame/model/ingameScreen.model.ts'
import type { PointerId } from '@/shared/utils/pointer/types'




const createGame = () => {
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
}






export default function IngameScreen() {
  const [game, setGame] = useState<Game>(createGame)
  const [ingameData, setIngameData] = useState<IngameData>(() => gameToIngameData(game))
  
  useEffect(() => {
    const onChange = () => { setIngameData(gameToIngameData(game)) }
    game.onChange(onChange)
    game.resume()
    return () => {
      game.pause()
      game.offChange(onChange)
    }
  }, [game])
  
  
  
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
  
  
  
  
  
  const refToFocus = useFocusWithinElem()
  
  const { onKeyboardKeyStartEnd, onKeyboardKeyHold, onKeyboardKeyDownClick } = useAppActions(game)
  
  const [lockSelection, unlockSelection] = useLockSelection()
  
  
  const [getDPos, setDPos] = useRecord<PointerId, { dCol: number, dRot: number }>()
  
  
  const { tryLock, unlock } = useLockPointerDrag()
  const onPointer = usePointer((move, upd) => {
    const { ev, start, wasStart, first, last, move: m, vp0, vp, pointerId } = move
    if (wasStart) {
      if (first) {
        if (!tryLock(pointerId)) { upd({ wasStart: false }); return }
        ev.currentTarget.setPointerCapture(pointerId)
        lockSelection()
      }
      
      if (layout) {
        const blockSz = (() => {
          if (layout === 'land') return landSizes.wOfH(landSizes.blockSz, getWh().h)
          if (layout === 'landSm') return landSmSizes.wOfH(landSmSizes.blockSz, getWh().h)
          if (layout === 'port') return portSizes.hOfW(portSizes.blockSz, getWh().w)
          assertNever(layout)
        })()
        
        const prev = getDPos(pointerId) ?? { dCol: 0, dRot: 0 }
        const dCol = floorTo0(m.x / blockSz)
        const dRot = floorTo0(m.y / blockSz)
        for (let d = prev.dCol + 1; d <= dCol; d++) {
          game.tetris.moveRight()
        }
        for (let d = prev.dCol - 1; d >= dCol; d--) {
          game.tetris.moveLeft()
        }
        for (let d = prev.dRot + 1; d <= dRot; d++) {
          game.tetris.rotateRight()
        }
        for (let d = prev.dRot - 1; d >= dRot; d--) {
          game.tetris.rotateLeft()
        }
        setDPos(pointerId, { dCol, dRot })
        
        setIngameData(gameToIngameData(game))
      }
      
      if (last) {
        setDPos(pointerId, undefined)
        unlock(pointerId)
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
        {...propsOf(onKeyboardKeyStartEnd, onKeyboardKeyHold, onKeyboardKeyDownClick, onPointer())}
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
          hasAnyBlocksAtOrAbove0={tetris.field.hasAnyBlocksAtOrAbove(0)}
          {...stats}
        />
      )}
    </>
  )
}




function useAppActions(game: Game) {
  const { inputLayout } = use(InputLayoutContext)
  
  const onKeyboardKeyStartEnd = useKeyStartEnd(ev => {
    if (ev.type === 'keyStart') {
      if (isKeyboardAction('ingame', 'moveLeft', { code: ev.keyId }, inputLayout)) {
        game.startMoveLeft()
      }
    }
    if (ev.type === 'keyEnd') {
      if (isKeyboardAction('ingame', 'moveLeft', { code: ev.keyId }, inputLayout)) {
        game.stopMoveLeft()
      }
    }
  })
  
  const onKeyboardKeyHold = useKeyHold({ interval: 150 }, ev => {
    if (isKeyboardAction('ingame', 'moveRight', ev, inputLayout)) {
      game.moveRight()
    }
    if (isKeyboardAction('ingame', 'moveDown', ev, inputLayout)) {
      game.moveDown()
    }
    if (isKeyboardAction('ingame', 'moveUp', ev, inputLayout)) {
      game.moveUp()
    }
  })
  
  const onKeyboardKeyDownClick = useKeyDownClick(ev => {
    if (isKeyboardAction('ingame', 'rotateLeft', ev, inputLayout)) {
      game.rotateLeft()
    }
    if (isKeyboardAction('ingame', 'rotateRight', ev, inputLayout)) {
      game.rotateRight()
    }
    if (isKeyboardAction('ingame', 'hardDrop', ev, inputLayout)) {
      game.hardDrop()
    }
  })
  
  
  useGamepadKeyHold({ interval: 150 }, ev => {
    if (isGamepadKeyAction('ingame', 'moveLeft', ev, inputLayout)) {
      game.moveLeft()
    }
    if (isGamepadKeyAction('ingame', 'moveRight', ev, inputLayout)) {
      game.moveRight()
    }
    if (isGamepadKeyAction('ingame', 'moveDown', ev, inputLayout)) {
      game.moveDown()
    }
    if (isGamepadKeyAction('ingame', 'moveUp', ev, inputLayout)) {
      game.moveUp()
    }
  })
  
  useGamepadDownClick(ev => {
    if (isGamepadKeyAction('ingame', 'rotateLeft', ev, inputLayout)) {
      game.rotateLeft()
    }
    if (isGamepadKeyAction('ingame', 'rotateRight', ev, inputLayout)) {
      game.rotateRight()
    }
    if (isGamepadKeyAction('ingame', 'hardDrop', ev, inputLayout)) {
      game.hardDrop()
    }
  })
  
  return { onKeyboardKeyStartEnd, onKeyboardKeyHold, onKeyboardKeyDownClick }
}



function gameToIngameData(game: Game): IngameData {
  const { hiScore, score, level, lines, tetris } = game
  return { hiScore, score, level, lines, tetris: tetris.copy() }
}