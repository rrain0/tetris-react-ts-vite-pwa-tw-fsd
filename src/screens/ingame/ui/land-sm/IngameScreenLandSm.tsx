import type { IngameStats } from '@/screens/ingame/model/ingameScreen.model.ts'
import IngameControls from '@/screens/ingame/ui/controls/IngameControls.tsx'
import type { Field } from '@@/lib/tetris/tetris-engine/entities/field/model/field.ts'
import { elemSizeContain } from '@@/utils/css/elemSizeContain.ts'
import { ingameScreenLandSmSizes } from '@/screens/ingame/ui/land-sm/ingameScreenLandSmSizes.ts'
import TetrisField from '@/widgets/tetris-field/ui/TetrisField.tsx'



export type IngameScreenLandSmProps = IngameStats & {
  field: Field
  nextField: Field
}

export default function IngameScreenLandSm(props: IngameScreenLandSmProps) {
  const { field: gameField, nextField, hiScore, score, level, lines } = props
  
  const {
    block, field, fieldBox, side, gameControls, game,
    wInCqh, hInCqh, wInPxh,
  } = ingameScreenLandSmSizes
  
  const containerSt = { height: elemSizeContain(game.ratio).height }
  const gameSt = {
    grid: `
      'spaceL fieldBox ... side spaceR ... controlsSpace' 100%
      / 1fr ${wInCqh(fieldBox.w)}
      ${wInCqh(game.g)} ${wInCqh(side.w)} 1fr ${wInCqh(game.g)}
      ${wInCqh(gameControls.w)}
    `,
  }
  const fieldBoxSt = { borderWidth: wInCqh(fieldBox.bdSz), width: wInCqh(fieldBox.w) }
  const fieldSt = {
    width: wInCqh(field.w),
    height: hInCqh(field.h),
  }
  const sideSt = { width: wInCqh(side.w), gap: wInCqh(side.g) }
  const titleSt = { fontSize: wInCqh(side.title.h) }
  const digitsSt = { fontSize: wInCqh(side.digit.h) }
  const nextSt = { width: wInCqh(side.next.w) }
  const controlsSt = { gap: wInCqh(gameControls.g) }
  const controlsIcSt = {
    width: wInCqh(gameControls.ic.sz),
    height: wInCqh(gameControls.ic.sz),
  }
  
  return (
    <>
      <div cn='w-full container-size' st={containerSt}>
        <div cn='grid sz-full' st={gameSt}>
          
          <div cn='flex col in-area-[fieldBox] w-ct bd-cl-[var(--cl-tetris-field-bd)] rad-[1cqh]'
            st={fieldBoxSt}
          >
            <TetrisField cn='w-full' st={fieldSt} field={gameField}/>
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
