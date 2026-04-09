import { AppActivityContext } from '@lib/activity-manager/context/AppActivityContext.ts'
import {
  useGamepadDownClick
} from '@lib/gamepad-input-events/gamepad-down-click/useGamepadDownClick.ts'
import { useGamepadKeyHold } from '@lib/gamepad-input-events/gamepad-key-hold/useGamepadKeyHold.ts'
import { useKeyDownClick } from '@lib/native-button-events/useKeyDownClick.ts'
import { useKeyHold } from '@lib/native-button-events/useKeyHold.ts'
import { Game } from '@lib/tetris-engine/entities/game/model/game.ts'
import {
  newISrs, newJSrs, newLSrs, newOSrs, newSSrs, newTSrs, newZSrs,
} from '@lib/tetris-engine/entities/piece/model/tetrominoSrs.ts'
import { useFocusWithinElem } from '@utils/elem/useFocusWithinElem.ts'
import { combineProps } from '@utils/react/props/combineProps.ts'
import type { SetterOrUpdater } from '@utils/ts/ts.ts'
import { InputLayoutContext } from 'entities/input-layout/context/InputLayoutContext.ts'
import { isGamepadKeyAction } from 'entities/input-layout/model/isGamepadKeyAction.ts'
import { isKeyboardAction } from 'entities/input-layout/model/isKeyboardAction.ts'
import { use, useState } from 'react'
import IngameScreenLand from 'screens/ingame/IngameScreenLand.tsx'
import IngameScreenLandSm from 'screens/ingame/IngameScreenLandSm.tsx'
import PageFullVp from 'shared/components/elems/PageFullVp.tsx'
import bg from '@assets/im/bg4.jpg'




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
  
  
  const [game, setGame] = useState(() => {
    const game = new Game()
    //game.current = newOSrs(undefined)
    game.current.x = 4
    game.current.y = 5
    game.field.addPiece(newTSrs(undefined, 0, 14).toRotatedRight().next().value!.toRotatedRight().next().value!)
    game.field.addPiece(newISrs(undefined, -3, 15).toRotatedRight().next().value!)
    game.field.addPiece(newZSrs(undefined, 1, 18))
    game.field.addPiece(newSSrs(undefined, 3, 15).toRotatedLeft().next().value!)
    game.field.addPiece(newJSrs(undefined, 4, 18))
    game.field.addPiece(newLSrs(undefined, 6, 14).toRotatedRight().next().value!)
    game.field.addPiece(newOSrs(undefined, 6, 18))
    game.field.addPiece(newTSrs(undefined, 8, 16).toRotatedLeft().next().value!)
    return game
  })
  
  const refToFocus = useFocusWithinElem()
  
  const { onKeyboardKeyHold, onKeyboardKeyDownClick } = useAppActions(setGame)
  const layout = (() => {
    return 'landSm' as const
    
    return 'land' as const
    return 'landSm' as const
    return 'portSm' as const
    return 'port' as const
  })()
  
  const pageProps = combineProps(onKeyboardKeyHold, onKeyboardKeyDownClick)
  
  return (
    <>
      <PageFullVp cn='p-[8] bg-pos-[center] bg-sz-[cover]'
        st={{ backgroundImage: `url(${bg})` }}
        ref={refToFocus}
        tabIndex={-1}
        {...pageProps}
      >
        <div cn='sz-full grid center2 container-size'>
          {layout === 'land' && <IngameScreenLand game={game}/>}
          {layout === 'landSm' && <IngameScreenLandSm game={game}/>}
        </div>
      </PageFullVp>
    </>
  )
}



function useAppActions(setGame: SetterOrUpdater<Game>) {
  const { inputLayout } = use(InputLayoutContext)
  
  const onKeyboardKeyHold = useKeyHold({ interval: 150 }, ev => {
    if (isKeyboardAction('ingame', 'moveLeft', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.moveCurrentPieceLeft()
        return game
      })
    }
    if (isKeyboardAction('ingame', 'moveRight', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.moveCurrentPieceRight()
        return game
      })
    }
    if (isKeyboardAction('ingame', 'moveDown', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.moveCurrentPieceDown()
        return game
      })
    }
    if (isKeyboardAction('ingame', 'moveUp', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.moveCurrentPieceUp()
        return game
      })
    }
  })
  
  const onKeyboardKeyDownClick = useKeyDownClick(ev => {
    if (isKeyboardAction('ingame', 'rotateLeft', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.rotateCurrentPieceLeft()
        return game
      })
    }
    if (isKeyboardAction('ingame', 'rotateRight', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.rotateCurrentPieceRight()
        return game
      })
    }
    if (isKeyboardAction('ingame', 'hardDrop', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.hardDropCurrentPiece()
        return game
      })
    }
  })
  
  
  useGamepadKeyHold({ interval: 150 }, ev => {
    if (isGamepadKeyAction('ingame', 'moveLeft', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.moveCurrentPieceLeft()
        return game
      })
    }
    if (isGamepadKeyAction('ingame', 'moveRight', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.moveCurrentPieceRight()
        return game
      })
    }
    if (isGamepadKeyAction('ingame', 'moveDown', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.moveCurrentPieceDown()
        return game
      })
    }
    if (isGamepadKeyAction('ingame', 'moveUp', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.moveCurrentPieceUp()
        return game
      })
    }
  })
  
  useGamepadDownClick(ev => {
    if (isGamepadKeyAction('ingame', 'rotateLeft', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.rotateCurrentPieceLeft()
        return game
      })
    }
    if (isGamepadKeyAction('ingame', 'rotateRight', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.rotateCurrentPieceRight()
        return game
      })
    }
    if (isGamepadKeyAction('ingame', 'hardDrop', ev, inputLayout)) {
      setGame(game => {
        game = game.copy()
        game.hardDropCurrentPiece()
        return game
      })
    }
  })
  
  return { onKeyboardKeyHold, onKeyboardKeyDownClick }
}
