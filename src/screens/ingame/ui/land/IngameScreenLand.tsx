import type { IngameStats } from '@/screens/ingame/model/ingameScreen.model.ts'
import IngameControls from '@/screens/ingame/ui/controls/IngameControls.tsx'
import type { Field } from '@@/lib/tetris/tetris-engine/entities/field/model/field.ts'
import { elemSizeContain } from '@@/utils/css/elemSizeContain.ts'
import { ingameScreenLandSizes } from '@/screens/ingame/ui/land/ingameScreenLandSizes.ts'
import TetrisField from '@/widgets/tetris-field/ui/TetrisField.tsx'



export type IngameScreenLandProps = IngameStats & {
  field: Field
  nextField: Field
}

export default function IngameScreenLand(props: IngameScreenLandProps) {
  const { field: gameField, nextField, hiScore, score, level, lines } = props
  
  const {
    block, field, fieldBox, side, gameControls, game,
    wInCqh, hInCqh, wInPxh,
  } = ingameScreenLandSizes
  
  const containerSt = { height: elemSizeContain(game.ratio).height }
  const gameSt = {
    gap: wInCqh(game.g),
    grid: `
      'controlsLSpace sideLeftSpace fieldBox side controlsRSpace' 100%
      / minmax(${wInCqh(gameControls.w)}, 1fr) ${wInCqh(side.w)}
      ${wInCqh(fieldBox.w)} ${wInCqh(side.w)}
      minmax(${wInCqh(gameControls.w)}, 1fr)
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
        <div cn='sz-full grid' st={gameSt}>
          
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
