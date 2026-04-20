import type { IngameStats } from '@/screens/ingame/model/ingameScreen.ts'
import IngameControls from '@/screens/ingame/ui/controls/IngameControls.tsx'
import type { Tetris } from '@@/lib/tetris-engine/entities/tetris/model/tetris.ts'
import { elemSizeContain } from '@@/utils/css/elemSizeContain.ts'
import { ingameScreenLandSmSizes } from '@/screens/ingame/ui/land-sm/ingameScreenLandSmSizes.ts'
import TetrisField from '@/widgets/tetris-field/ui/TetrisField.tsx'



export type IngameScreenLandSmProps = IngameStats & {
  tetris: Tetris
}

export default function IngameScreenLandSm(props: IngameScreenLandSmProps) {
  const { tetris, hiScore, score, level, lines } = props
  
  const field = tetris.renderField()
  const nextField = tetris.renderNextField()
  
  const {
    blockSz,
    fieldBoxBdSz, fieldBoxW, fieldBoxH,
    sideW, sideG, nextW, titleH, digitH,
    controlsIcSz, controlsG, controlsW,
    gameG, gameW, gameH, gameRatio,
    w,
  } = ingameScreenLandSmSizes(nextField.cols)
  
  const containerSt = { width: '100%', height: elemSizeContain(gameRatio).height }
  const gameSt = {
    grid: `
      'spaceL fieldBox ... side spaceR ... controlsSpace' 100%
      / 1fr ${w(fieldBoxW)} ${w(gameG)} ${w(sideW)} 1fr ${w(gameG)} ${w(controlsW)}
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
      <div cn='w-full container-size' st={containerSt}>
        <div cn='grid sz-full' st={gameSt}>
          
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
      
      <IngameControls
        containerSt={containerSt}
        controlsSt={controlsSt}
        controlsIcSt={controlsIcSt}
      />
    </>
  )
}
