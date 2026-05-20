import PieceControls from '@/screens/ingame/ui/piece-controls/PieceControls.tsx'
import { ingameScreenPortSizes } from '@/screens/ingame/ui/port/ingameScreenPortSizes.ts'
import EnvSafeAreaInset from '@@/components/elems/page/EnvSafeAreaInset.tsx'
import {
  useGamepadDownClick
} from '@@/lib/input/gamepad-key/useGamepadDownClick.ts'
import { useGamepadKeyStartEnd } from '@@/lib/input/gamepad-key/useGamepadKeyStartEnd.ts'
import { useKeyDownClick } from '@@/lib/input/key/useKeyDownClick.ts'
import { useKeyStartEnd } from '@@/lib/input/key/useKeyStartEnd.ts'
import { useLockPointerDrag } from '@@/lib/input/shared/useLockPointerDrag.ts'
import useLockSelection from '@@/lib/input/shared/useLockSelection.ts'
import { usePointer } from '@@/lib/input/pointer/usePointer.ts'
import { useRecord } from '@@/utils/react/more/useRecord.ts'
import { Game, type GameEv } from '@@/lib/tetris/game-engine/entities/game/model/game.ts'
import {
  newISrs, newJSrs, newLSrs, newOSrs, newSSrs, newTSrs, newZSrs,
} from '@@/lib/tetris/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { elemProps } from '@@/utils/dom/elemProps.ts'
import { useFocusWithinElem } from '@@/utils/dom/useFocusWithinElem.ts'
import { useResizeRef } from '@@/utils/dom/useResizeRef.ts'
import { propsOf } from '@@/utils/react/props/combineProps.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import { assertNever } from '@@/utils/ts/ts.ts'
import { InputLayoutContext } from '@/entities/input-layout/context/InputLayoutContext.ts'
import { isGamepadKeyAction } from '@/entities/input-layout/model/isGamepadKeyAction.ts'
import { isKeyboardKeyAction } from '@/entities/input-layout/model/isKeyboardKeyAction.ts'
import React, { use, useEffect, useState } from 'react'
import { ingameScreenLandSmSizes } from '@/screens/ingame/ui/land-sm/ingameScreenLandSmSizes.ts'
import IngameScreenLand from '@/screens/ingame/ui/land/IngameScreenLand.tsx'
import IngameScreenLandSm from '@/screens/ingame/ui/land-sm/IngameScreenLandSm.tsx'
import { ingameScreenLandSizes } from '@/screens/ingame/ui/land/ingameScreenLandSizes.ts'
import IngameScreenPort from '@/screens/ingame/ui/port/IngameScreenPort.tsx'
import PageFullVp from '@@/components/elems/page/PageFullVp.tsx'
import bg from '@@/assets/im/bg4.jpg'
import type { IngameData } from '@/screens/ingame/model/ingameScreen.model.ts'
import type { PointerId } from '@/shared/utils/pointer/types'
import { isMobile } from 'react-device-detect'




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
  
  const [getIsNextPieceSpawned, setIsNextPieceSpawned] = useRefGetSet(false)
  
  useEffect(() => {
    const onNeedRedraw = () => { setIngameData(gameToIngameData(game)) }
    game.onNeedRedraw(onNeedRedraw)
    game.resume()
    return () => {
      game.pause()
      game.offNeedRedraw(onNeedRedraw)
    }
  }, [game])
  
  useEffect(() => {
    const onGameEv = (ev: GameEv) => {
      if (ev.type === 'nextPieceSpawned') setIsNextPieceSpawned(true)
    }
    game.onGameEv(onGameEv)
    return () => {
      game.offGameEv(onGameEv)
    }
  }, [game])
  
  
  
  const [layout, setLayout] = useState<Layout>(undefined)
  const [getWh, setWh] = useRefGetSet({ w: 0, h: 0 })
  
  const portSizes = ingameScreenPortSizes
  const landSmSizes = ingameScreenLandSmSizes
  const landSizes = ingameScreenLandSizes
  
  const refFun = useResizeRef(elem => {
    if (!elem) setLayout(undefined)
    else {
      const { ratio, wh } = elemProps(elem)
      //console.log('wh', wh, 'ratio', ratio)
      setWh(wh)
      if (ratio >= landSizes.game.ratio) setLayout('land')
      else if (ratio >= landSmSizes.game.ratio) setLayout('landSm')
      else setLayout('port')
    }
  })
  
  
  
  
  
  const refToFocus = useFocusWithinElem()
  
  const appActionsEvHandlers = useAppActions(game)
  
  
  
  const [lockSelection, unlockSelection] = useLockSelection()
  const { tryLock, unlock } = useLockPointerDrag()
  type DPos = { isMoved: boolean, isRotated: boolean, mCol: number, mRot: number }
  const [getDPos, setDPos] = useRecord<PointerId, DPos>()
  
  const onPointer = usePointer((pointer, update) => {
    const { ev, start, wasStart, first, last, vp0, vp, pointerId } = pointer
    if (wasStart) {
      if (first) {
        if (!tryLock(pointerId)) { update(pointerId, { wasStart: false }); return }
        ev.currentTarget.setPointerCapture(pointerId)
        lockSelection()
      }
      
      let updatedPointer
      
      if (getIsNextPieceSpawned()) {
        updatedPointer = update(pointerId, { vp0: vp, moved: { x: 0, y: 0 } })
        setDPos(pointerId, { isMoved: false, isRotated: false, mCol: 0, mRot: 0 })
        setIsNextPieceSpawned(false)
      }
      
      if (layout) {
        const { moved } = updatedPointer ?? pointer
        
        const blockSz = (() => {
          if (layout === 'land') return landSizes.wInPxh(landSizes.block.sz, getWh().h)
          if (layout === 'landSm') return landSmSizes.wInPxh(landSmSizes.block.sz, getWh().h)
          if (layout === 'port') return portSizes.hInPxw(portSizes.block.sz, getWh().w)
          assertNever(layout)
        })()
        
        const blocksForMove = 1
        const blocksForRot = 2
        
        const prev = getDPos(pointerId) ?? {
          isMoved: false, isRotated: false, mCol: 0, mRot: 0,
        }
        
        let { isMoved, isRotated } = prev
        const mCol = Math.floor(moved.x / (blockSz * blocksForMove))
        const mRot = Math.floor(moved.y / (blockSz * blocksForRot))
        
        let dCol = mCol - prev.mCol
        let dRot = mRot - prev.mRot
        
        if (prev.mCol === 0 && mCol === -1 && !isMoved) dCol++
        if (prev.mRot === 0 && mRot === -1 && !isRotated) dRot++
        
        if (dCol) isMoved = true
        if (dRot) isRotated = true
        
        // TODO game moves, not tetris moves.
        if (dCol > 0) while (dCol-- > 0) game.tetris.moveRight()
        else while (dCol++ < 0) game.tetris.moveLeft()
        
        if (dRot > 0) while (dRot-- > 0) game.tetris.rotateRight()
        else while (dRot++ < 0) game.tetris.rotateLeft()
        
        setDPos(pointerId, { isMoved, isRotated, mCol, mRot })
        
        setIngameData(gameToIngameData(game))
      }
      
      if (last) {
        setDPos(pointerId, undefined)
        unlock(pointerId)
        unlockSelection()
      }
    }
  })
  
  
  // TODO Refactor
  return (
    <>
      <PageFullVp
        cn={`bg-pos-[center] bg-sz-[cover] no-touch-action
          grid plc-[stretch]
        `}
        st={{ backgroundImage: `url(${bg})` }}
        ref={refToFocus}
        tabIndex={-1}
        {...propsOf(...appActionsEvHandlers, onPointer())}
      >
        <EnvSafeAreaInset>
          
          <div cn='sz-full p-[8]'>
            <div cn='sz-full stack center2 container-size' ref={refFun}>
              
              <ScreenLayout layout={layout} {...ingameData}/>
              
              {isMobile && <PieceControls cn='in-area-[1/1/-1/-1]' game={game}/>}
            
            </div>
          </div>
          
        </EnvSafeAreaInset>
      </PageFullVp>
      
      
      {/* <PageFullVp
       cn={`bg-pos-[center] bg-sz-[cover] no-touch-action
       grid plc-[stretch] bg-cl-[aquamarine]
       `}
       /> */}
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
      {layout === 'port' && (() => {
        const { field, nextGhost } = tetris.renderCombinedField()
        return (
          <IngameScreenPort
            combinedField={field}
            nextGhost={nextGhost}
            {...stats}
          />
        )
      })()}
    </>
  )
}




function useAppActions(game: Game) {
  const { inputLayout } = use(InputLayoutContext)
  
  const onKeyboardKeyStartEnd = useKeyStartEnd(ev => {
    if (ev.type === 'keyStart') {
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'moveLeft', ev.key)) {
        game.startMoveLeft()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'moveRight', ev.key)) {
        game.startMoveRight()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'rotateLeft', ev.key)) {
        game.startRotateLeft()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'rotateRight', ev.key)) {
        game.startRotateRight()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'moveUp', ev.key)) {
        game.startMoveUp()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'moveDown', ev.key)) {
        game.startSoftDrop()
      }
    }
    if (ev.type === 'keyEnd') {
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'moveLeft', ev.key)) {
        game.stopMoveLeft()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'moveRight', ev.key)) {
        game.stopMoveRight()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'rotateLeft', ev.key)) {
        game.stopRotateLeft()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'rotateRight', ev.key)) {
        game.stopRotateRight()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'moveUp', ev.key)) {
        game.stopMoveUp()
      }
      if (isKeyboardKeyAction(inputLayout, 'ingame', 'moveDown', ev.key)) {
        game.stopSoftDrop()
      }
    }
  })
  
  const onKeyboardKeyDownClick = useKeyDownClick(ev => {
    if (isKeyboardKeyAction(inputLayout, 'ingame', 'hardDrop', ev.code)) {
      game.startHardDrop()
    }
  })
  
  
  const onGamepadKeyStartEnd = useGamepadKeyStartEnd(ev => {
    if (ev.type === 'gamepadKeyStart') {
      if (isGamepadKeyAction(inputLayout, 'ingame', 'moveLeft', ev.signalId)) {
        game.startMoveLeft()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'moveRight', ev.signalId)) {
        game.startMoveRight()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'rotateLeft', ev.signalId)) {
        game.startRotateLeft()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'rotateRight', ev.signalId)) {
        game.startRotateRight()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'moveDown', ev.signalId)) {
        game.startSoftDrop()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'moveDown', ev.signalId)) {
        game.startSoftDrop()
      }
    }
    if (ev.type === 'gamepadKeyEnd') {
      if (isGamepadKeyAction(inputLayout, 'ingame', 'moveLeft', ev.signalId)) {
        game.stopMoveLeft()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'moveRight', ev.signalId)) {
        game.stopMoveRight()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'rotateLeft', ev.signalId)) {
        game.stopRotateLeft()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'rotateRight', ev.signalId)) {
        game.stopRotateRight()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'moveDown', ev.signalId)) {
        game.stopSoftDrop()
      }
      if (isGamepadKeyAction(inputLayout, 'ingame', 'moveDown', ev.signalId)) {
        game.stopSoftDrop()
      }
    }
  })
  
  useGamepadDownClick(ev => {
    if (isGamepadKeyAction(inputLayout, 'ingame', 'hardDrop', ev.signalId)) {
      game.startHardDrop()
    }
  })
  
  return [
    onKeyboardKeyStartEnd, onKeyboardKeyDownClick,
    onGamepadKeyStartEnd,
  ] as const
}



function gameToIngameData(game: Game): IngameData {
  const { hiScore, score, level, lines, tetris } = game
  return { hiScore, score, level, lines, tetris: tetris.copy() }
}