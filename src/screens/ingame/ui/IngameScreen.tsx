import { AppActivityContext } from '@@/lib/activity-manager/context/AppActivityContext.ts'
import {
  useGamepadDownClick
} from '@@/lib/gamepad-input-events/gamepad-down-click/useGamepadDownClick.ts'
import {
  useGamepadKeyHold,
} from '@@/lib/gamepad-input-events/gamepad-key-hold/useGamepadKeyHold.ts'
import { useKeyDownClick } from '@@/lib/native-button-events/useKeyDownClick.ts'
import { useKeyHold } from '@@/lib/native-button-events/useKeyHold.ts'
import { Game } from '@@/lib/tetris-engine/entities/game/model/game.ts'
import { Tetris } from '@@/lib/tetris-engine/entities/tetris/model/tetris.ts'
import {
  newISrs, newJSrs, newLSrs, newOSrs, newSSrs, newTSrs, newZSrs,
} from '@@/lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { elemProps } from '@@/utils/elem/elemProps.ts'
import { useFocusWithinElem } from '@@/utils/elem/useFocusWithinElem.ts'
import { useResizeRef } from '@@/utils/elem/useResizeRef.ts'
import { combineProps } from '@@/utils/react/props/combineProps.ts'
import type { Setter, SetterOrUpdater } from '@@/utils/ts/ts.ts'
import { InputLayoutContext } from '@/entities/input-layout/context/InputLayoutContext.ts'
import { isGamepadKeyAction } from '@/entities/input-layout/model/isGamepadKeyAction.ts'
import { isKeyboardAction } from '@/entities/input-layout/model/isKeyboardAction.ts'
import React, { use, useState } from 'react'
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



const game = (() => {
  const game = new Game()
  game.tetris.current!.x = 4
  game.tetris.current!.y = 5
  game.tetris.field.addPiece(
    newTSrs({ x: 0, y: 14 }).toRotatedRight().next().value!.toRotatedRight().next().value!
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
const copyTetris = () => game.tetris.copy()



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
  
  const [stats, setStats] = useState<IngameStats>({
    hiScore: 123456,
    score: 123456,
    level: 12,
    lines: 57,
  })
  
  const [tetris, setTetris] = useState<Tetris>(copyTetris)
  
  
  const refToFocus = useFocusWithinElem()
  
  
  const [layout, setLayout] = useState<Layout>(undefined)
  
  const refFun = useResizeRef(elem => {
    if (!elem) setLayout(undefined)
    else {
      const { ratio } = elemProps(elem)
      if (ratio >= ingameScreenLandSizes().gameRatio) setLayout('land')
      else if (ratio >= ingameScreenLandSmSizes().gameRatio) setLayout('landSm')
      else setLayout('port')
    }
  })
  
  
  const { onKeyboardKeyHold, onKeyboardKeyDownClick } = useAppActions({ game, setTetris, setStats })
  
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
          <ScreenLayout layout={layout} tetris={tetris} {...stats}/>
        </div>
      </PageFullVp>
    </>
  )
}



type Layout = 'land' | 'landSm' | 'port' | undefined

function ScreenLayout({ layout, tetris, ...stats }: IngameStats & {
  layout: Layout
  tetris: Tetris
}) {
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
  setTetris: SetterOrUpdater<Tetris>,
  setStats: Setter<IngameStats>,
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



function moveLeft({ game, setStats, setTetris }: UseAppActionParams) {
  game.tetris.moveCurrentPieceLeft()
  const { stats, tetris } = gameToStatsAndTetris(game)
  setStats(stats)
  setTetris(tetris)
}
function moveRight({ game, setStats, setTetris }: UseAppActionParams) {
  game.tetris.moveCurrentPieceRight()
  const { stats, tetris } = gameToStatsAndTetris(game)
  setStats(stats)
  setTetris(tetris)
}
function moveDown({ game, setStats, setTetris }: UseAppActionParams) {
  game.tetris.moveCurrentPieceDown()
  const { stats, tetris } = gameToStatsAndTetris(game)
  setStats(stats)
  setTetris(tetris)
}
function moveUp({ game, setStats, setTetris }: UseAppActionParams) {
  game.tetris.moveCurrentPieceUp()
  const { stats, tetris } = gameToStatsAndTetris(game)
  setStats(stats)
  setTetris(tetris)
}
function rotateLeft({ game, setStats, setTetris }: UseAppActionParams) {
  game.tetris.rotateCurrentPieceLeft()
  const { stats, tetris } = gameToStatsAndTetris(game)
  setStats(stats)
  setTetris(tetris)
}
function rotateRight({ game, setStats, setTetris }: UseAppActionParams) {
  game.tetris.rotateCurrentPieceRight()
  const { stats, tetris } = gameToStatsAndTetris(game)
  setStats(stats)
  setTetris(tetris)
}
function hardDrop({ game, setStats, setTetris }: UseAppActionParams) {
  game.tetris.dropCurrentPiece()
  game.tetris.lockCurrentPiece()
  const lines = game.tetris.getFullLines()
  game.tetris.clearLines(lines)
  game.tetris.dropLines(lines)
  game.tetris.spawnNewPieceOrGameOver()
  const { stats, tetris } = gameToStatsAndTetris(game)
  setStats(stats)
  setTetris(tetris)
}



function gameToStatsAndTetris(game: Game): { stats: IngameStats, tetris: Tetris } {
  const { hiScore, score, level, lines, tetris } = game
  return { stats: { hiScore, score, level, lines }, tetris: tetris.copy() }
}