import { AppActivityContext } from '@@/lib/activity-manager/context/AppActivityContext.ts'
import {
  useGamepadDownClick
} from '@@/lib/gamepad-input-events/gamepad-down-click/useGamepadDownClick.ts'
import {
  useGamepadKeyHold,
} from '@@/lib/gamepad-input-events/gamepad-key-hold/useGamepadKeyHold.ts'
import { useKeyDownClick } from '@@/lib/native-button-events/useKeyDownClick.ts'
import { useKeyHold } from '@@/lib/native-button-events/useKeyHold.ts'
import { Tetris } from '@@/lib/tetris-engine/entities/tetris/model/tetris.ts'
import {
  newISrs, newJSrs, newLSrs, newOSrs, newSSrs, newTSrs, newZSrs,
} from '@@/lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { elemProps } from '@@/utils/elem/elemProps.ts'
import { useFocusWithinElem } from '@@/utils/elem/useFocusWithinElem.ts'
import { useResizeRef } from '@@/utils/elem/useResizeRef.ts'
import { combineProps } from '@@/utils/react/props/combineProps.ts'
import type { SetterOrUpdater } from '@@/utils/ts/ts.ts'
import { InputLayoutContext } from '@/entities/input-layout/context/InputLayoutContext.ts'
import { isGamepadKeyAction } from '@/entities/input-layout/model/isGamepadKeyAction.ts'
import { isKeyboardAction } from '@/entities/input-layout/model/isKeyboardAction.ts'
import { use, useState } from 'react'
import { ingameScreenLandSmSizes } from '@/screens/ingame/ui/land-sm/ingameScreenLandSmSizes.ts'
import IngameScreenLand from '@/screens/ingame/ui/land/IngameScreenLand.tsx'
import IngameScreenLandSm from '@/screens/ingame/ui/land-sm/IngameScreenLandSm.tsx'
import { ingameScreenLandSizes } from '@/screens/ingame/ui/land/ingameScreenLandSizes.ts'
import IngameScreenPort from '@/screens/ingame/ui/port/IngameScreenPort.tsx'
import PageFullVp from '@@/components/elems/PageFullVp.tsx'
import bg from '@@/assets/im/bg4.jpg'
import type { IngameStats } from '@/screens/ingame/model/ingameScreen.ts'




// TODO loading screen to save images to RAM (dataUrl)
// TODO ℹ️Use keyboard or mouse key or touch to go fullscreen




export default function IngameScreen() {
  
  const { interactive } = use(AppActivityContext)
  
  const canUseInput = ({ key, mx, my }: {
    key?: string | undefined
    mx?: boolean | undefined
    my?: boolean | undefined
  }) => {
    if (!interactive) return false
    return true
  }
  
  
  const [tetris, setTetris] = useState(() => {
    const tetris = new Tetris()
    //tetris.current = newOSrs(undefined)
    tetris.current!.x = 4
    tetris.current!.y = 5
    tetris.field.addPiece(
      newTSrs({ x: 0, y: 14 }).toRotatedRight().next().value!.toRotatedRight().next().value!
    )
    tetris.field.addPiece(newISrs({ x: -3, y: 15 }).toRotatedRight().next().value!)
    tetris.field.addPiece(newZSrs({ x: 1, y: 18 }))
    tetris.field.addPiece(newSSrs({ x: 3, y: 15 }).toRotatedLeft().next().value!)
    tetris.field.addPiece(newJSrs({ x: 4, y: 18 }))
    tetris.field.addPiece(newLSrs({ x: 6, y: 14 }).toRotatedRight().next().value!)
    tetris.field.addPiece(newOSrs({ x: 6, y: 18 }))
    tetris.field.addPiece(newTSrs({ x: 8, y: 16 }).toRotatedLeft().next().value!)
    return tetris
  })
  const [ingameStats] = useState<IngameStats>({
    hiScore: 123456,
    score: 123456,
    level: 12,
    lines: 57,
  })
  
  
  const refToFocus = useFocusWithinElem()
  
  
  const [layout, setLayout] = useState<'land' | 'landSm' | 'port' | undefined>(undefined)
  
  const refFun = useResizeRef(elem => {
    if (!elem) setLayout(undefined)
    else {
      const { ratio } = elemProps(elem)
      if (ratio >= ingameScreenLandSizes().gameRatio) setLayout('land')
      else if (ratio >= ingameScreenLandSmSizes().gameRatio) setLayout('landSm')
      else setLayout('port')
    }
  })
  
  
  const { onKeyboardKeyHold, onKeyboardKeyDownClick } = useAppActions(setTetris)
  
  const pageProps = combineProps(onKeyboardKeyHold, onKeyboardKeyDownClick)
  
  
  return (
    <>
      <PageFullVp cn='p-[8] bg-pos-[center] bg-sz-[cover]'
        st={{ backgroundImage: `url(${bg})` }}
        ref={refToFocus}
        tabIndex={-1}
        {...pageProps}
      >
        <div cn='sz-full stack center2 container-size' ref={refFun}>
          {layout === 'land' && <IngameScreenLand tetris={tetris} {...ingameStats}/>}
          {layout === 'landSm' && <IngameScreenLandSm tetris={tetris} {...ingameStats}/>}
          {layout === 'port' && <IngameScreenPort tetris={tetris} {...ingameStats}/>}
        </div>
      </PageFullVp>
    </>
  )
}



function useAppActions(setTetris: SetterOrUpdater<Tetris>) {
  const { inputLayout } = use(InputLayoutContext)
  
  const onKeyboardKeyHold = useKeyHold({ interval: 150 }, ev => {
    if (isKeyboardAction('ingame', 'moveLeft', ev, inputLayout)) {
      setTetris(tetris => moveLeft(tetris))
    }
    if (isKeyboardAction('ingame', 'moveRight', ev, inputLayout)) {
      setTetris(tetris => moveRight(tetris))
    }
    if (isKeyboardAction('ingame', 'moveDown', ev, inputLayout)) {
      setTetris(tetris => moveDown(tetris))
    }
    if (isKeyboardAction('ingame', 'moveUp', ev, inputLayout)) {
      setTetris(tetris => moveUp(tetris))
    }
  })
  
  const onKeyboardKeyDownClick = useKeyDownClick(ev => {
    if (isKeyboardAction('ingame', 'rotateLeft', ev, inputLayout)) {
      setTetris(tetris => rotateLeft(tetris))
    }
    if (isKeyboardAction('ingame', 'rotateRight', ev, inputLayout)) {
      setTetris(tetris => rotateRight(tetris))
    }
    if (isKeyboardAction('ingame', 'hardDrop', ev, inputLayout)) {
      setTetris(tetris => hardDrop(tetris))
    }
  })
  
  
  useGamepadKeyHold({ interval: 150 }, ev => {
    if (isGamepadKeyAction('ingame', 'moveLeft', ev, inputLayout)) {
      setTetris(tetris => moveLeft(tetris))
    }
    if (isGamepadKeyAction('ingame', 'moveRight', ev, inputLayout)) {
      setTetris(tetris => moveRight(tetris))
    }
    if (isGamepadKeyAction('ingame', 'moveDown', ev, inputLayout)) {
      setTetris(tetris => moveDown(tetris))
    }
    if (isGamepadKeyAction('ingame', 'moveUp', ev, inputLayout)) {
      setTetris(tetris => moveUp(tetris))
    }
  })
  
  useGamepadDownClick(ev => {
    if (isGamepadKeyAction('ingame', 'rotateLeft', ev, inputLayout)) {
      setTetris(tetris => rotateLeft(tetris))
    }
    if (isGamepadKeyAction('ingame', 'rotateRight', ev, inputLayout)) {
      setTetris(tetris => rotateRight(tetris))
    }
    if (isGamepadKeyAction('ingame', 'hardDrop', ev, inputLayout)) {
      setTetris(tetris => hardDrop(tetris))
    }
  })
  
  return { onKeyboardKeyHold, onKeyboardKeyDownClick }
}



function moveLeft(tetris: Tetris) {
  tetris = tetris.copy()
  tetris.moveCurrentPieceLeft()
  return tetris
}
function moveRight(tetris: Tetris) {
  tetris = tetris.copy()
  tetris.moveCurrentPieceRight()
  return tetris
}
function moveDown(tetris: Tetris) {
  tetris = tetris.copy()
  tetris.moveCurrentPieceDown()
  return tetris
}
function moveUp(tetris: Tetris) {
  tetris = tetris.copy()
  tetris.moveCurrentPieceUp()
  return tetris
}
function rotateLeft(tetris: Tetris) {
  tetris = tetris.copy()
  tetris.rotateCurrentPieceLeft()
  return tetris
}
function rotateRight(tetris: Tetris) {
  tetris = tetris.copy()
  tetris.rotateCurrentPieceRight()
  return tetris
}
function hardDrop(tetris: Tetris) {
  tetris = tetris.copy()
  tetris.dropCurrentPiece()
  tetris.lockCurrentPiece()
  const lines = tetris.getFullLines()
  tetris.clearLines(lines)
  tetris.dropLines(lines)
  tetris.spawnNewPieceOrGameOver()
  return tetris
}
