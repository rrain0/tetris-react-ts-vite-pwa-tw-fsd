import type { Game } from '@lib/tetris-engine/entities/game/model/game.ts'
import { elemSizeContain } from '@utils/css/elemSizeContain.ts'
import { ingameScreenLandSizes } from '@screens/ingame/land/ingameScreenLandSizes.ts'
import TetrisField from '@widgets/tetris-field/ui/TetrisField.tsx'
import FullscreenIc from '@assets/ic/svg/ui/fullscreen.svg?react'
import PauseIc from '@assets/ic/svg/ui/pause.svg?react'



export type IngameScreenLandProps = {
  game: Game
}

export default function IngameScreenLand({ game }: IngameScreenLandProps) {
  const field = game.renderField()
  const nextField = game.renderNextField()
  
  const {
    blockSz,
    fieldBoxBdSz, fieldBoxW, fieldBoxH,
    sideW, sideG, nextW, titleH, digitH,
    icSz, icsG, icsW,
    gameG, gameW, gameH, gameRatio,
    w,
  } = ingameScreenLandSizes(nextField.cols)
  
  const containerSt = { height: elemSizeContain(gameRatio).height }
  const gameSt = {
    gap: w(gameG),
    grid: `
      'icsLSpace sideLeftSpace fieldBox side ics' 100%
      / minmax(${w(icsW)}, 1fr) ${w(sideW)}
      ${w(fieldBoxW)} ${w(sideW)}
      minmax(${w(icsW)}, 1fr)
    `,
  }
  const fieldBoxSt = { borderWidth: w(fieldBoxBdSz), width: w(fieldBoxW) }
  const sideSt = { width: w(sideW), gap: w(sideG) }
  const titleSt = { fontSize: w(titleH) }
  const digitsSt = { fontSize: w(digitH) }
  const nextSt = { width: w(nextW) }
  const icsSt = { gap: w(icsG) }
  const icSt = { width: w(icSz), height: w(icSz) }
  
  return (
    <div cn='w-full container-size' st={containerSt}>
      <div cn='sz-full grid' st={gameSt}>
        
        <div cn='flex col in-area-[fieldBox] w-ct bd-cl-[var(--cl-tetris-field-bd)] rad-[1cqh]'
          st={fieldBoxSt}
        >
          <TetrisField cn='w-full' field={field}/>
        </div>
        
        <div cn='flex col in-area-[side]' st={sideSt}>
          
          <div cn='txHudTitle' st={titleSt}>
            HI-SCORE
          </div>
          <div cn='flex col end'>
            <div cn='txHudDigits' st={digitsSt}>194638</div>
          </div>
          
          <div cn='txHudTitle' st={titleSt}>
            SCORE
          </div>
          <div cn='flex col end'>
            <div cn='txHudDigits' st={digitsSt}>1666</div>
          </div>
          
          <div cn='txHudTitle' st={titleSt}>
            LEVEL
          </div>
          <div cn='flex col end'>
            <div cn='txHudDigits' st={digitsSt}>12</div>
          </div>
          
          <div cn='txHudTitle' st={titleSt}>
            LINES
          </div>
          <div cn='flex col end'>
            <div cn='txHudDigits' st={digitsSt}>57</div>
          </div>
          
          <div cn='txHudTitle' st={titleSt}>
            NEXT
          </div>
          <div cn='flex col end'>
            <TetrisField st={nextSt} field={nextField}/>
          </div>
          
        </div>
        
        <div cn='flex row start-end in-area-[ics]' st={icsSt}>
          <div cn='flex col center2' st={icSt}>
            <FullscreenIc cn={`sz-full ${icCn}`}/>
          </div>
          <div cn='flex col center2' st={icSt}>
            <PauseIc cn={`sz-full ${icCn}`}/>
          </div>
        </div>
      
      </div>
    </div>
  )
}



// Content styles
const icCn = 'cl-[var(--cl-hud-tx)] svg-curr-cl'
