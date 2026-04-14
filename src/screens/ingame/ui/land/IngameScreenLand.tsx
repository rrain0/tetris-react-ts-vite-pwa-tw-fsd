import type { IngameStats } from '@/screens/ingame/model/ingameScreen.ts'
import type { Game } from '@@/lib/tetris-engine/entities/game/model/game.ts'
import { elemSizeContain } from '@@/utils/css/elemSizeContain.ts'
import { ingameScreenLandSizes } from '@/screens/ingame/ui/land/ingameScreenLandSizes.ts'
import TetrisField from '@/widgets/tetris-field/ui/TetrisField.tsx'
import FullscreenIc from '@@/assets/ic/svg/ui/fullscreen.svg?react'
import PauseIc from '@@/assets/ic/svg/ui/pause.svg?react'



export type IngameScreenLandProps = IngameStats & {
  game: Game
}

export default function IngameScreenLand(props: IngameScreenLandProps) {
  const { game, hiScore, score, level, lines } = props
  
  const field = game.renderField()
  const nextField = game.renderNextField()
  
  const {
    blockSz,
    fieldBoxBdSz, fieldBoxW, fieldBoxH,
    sideW, sideG, nextW, titleH, digitH,
    controlsIcSz, controlsG, controlsW,
    gameG, gameW, gameH, gameRatio,
    w,
  } = ingameScreenLandSizes(nextField.cols)
  
  const containerSt = { height: elemSizeContain(gameRatio).height }
  const gameSt = {
    gap: w(gameG),
    grid: `
      'controlsLSpace sideLeftSpace fieldBox side controlsRSpace' 100%
      / minmax(${w(controlsW)}, 1fr) ${w(sideW)}
      ${w(fieldBoxW)} ${w(sideW)}
      minmax(${w(controlsW)}, 1fr)
    `,
  }
  const fieldBoxSt = { borderWidth: w(fieldBoxBdSz), width: w(fieldBoxW) }
  const sideSt = { width: w(sideW), gap: w(sideG) }
  const titleSt = { fontSize: w(titleH) }
  const digitsSt = { fontSize: w(digitH) }
  const nextSt = { width: w(nextW) }
  const controlsSt = { gap: w(controlsG) }
  const controlsIcSt = { width: w(controlsIcSz), height: w(controlsIcSz) }
  
  return (
    <>
      {/* Controls container */}
      <div cn='w-full jus-end flex row start-end container-size' st={containerSt}>
        <div cn='flex row start-end' st={controlsSt}>
          <div cn='flex col center2' st={controlsIcSt}>
            <FullscreenIc cn={`sz-full ${icCn}`}/>
          </div>
          <div cn='flex col center2' st={controlsIcSt}>
            <PauseIc cn={`sz-full ${icCn}`}/>
          </div>
        </div>
      </div>
      
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
              <div cn='txHudDigits' st={digitsSt}>{hiScore}</div>
            </div>
            
            <div cn='txHudTitle' st={titleSt}>
              SCORE
            </div>
            <div cn='flex col end'>
              <div cn='txHudDigits' st={digitsSt}>{score}</div>
            </div>
            
            <div cn='txHudTitle' st={titleSt}>
              LEVEL
            </div>
            <div cn='flex col end'>
              <div cn='txHudDigits' st={digitsSt}>{level}</div>
            </div>
            
            <div cn='txHudTitle' st={titleSt}>
              LINES
            </div>
            <div cn='flex col end'>
              <div cn='txHudDigits' st={digitsSt}>{lines}</div>
            </div>
            
            <div cn='txHudTitle' st={titleSt}>
              NEXT
            </div>
            <div cn='flex col end'>
              <TetrisField st={nextSt} field={nextField}/>
            </div>
          
          </div>
        
        </div>
      </div>
    </>
  )
}



// Content styles
const icCn = 'cl-[var(--cl-hud-tx)] svg-curr-cl'
