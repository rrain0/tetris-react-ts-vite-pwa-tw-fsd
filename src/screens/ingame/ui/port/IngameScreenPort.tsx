import IngameControls from '@/screens/ingame/ui/controls/IngameControls.tsx'
import type { Field } from '@@/lib/tetris/tetris-engine/entities/field/model/field.ts'
import { elemSizeContain } from '@@/utils/css/elemSizeContain.ts'
import { ingameScreenPortSizes } from '@/screens/ingame/ui/port/ingameScreenPortSizes.ts'
import TetrisField from '@/widgets/tetris-field/ui/TetrisField.tsx'
import type { IngameStats } from '@/screens/ingame/model/ingameScreen.model.ts'



export type IngameScreenPortProps = IngameStats & {
  combinedField: Field
  nextGhost: boolean
}

export default function IngameScreenPort(props: IngameScreenPortProps) {
  const { combinedField, nextGhost, hiScore, score, level, lines } = props
  
  const {
    block, fieldBox, comboField, comboFieldBox, top, bottom, gameControls, game,
    wInCqw, hInCqw,
  } = ingameScreenPortSizes
  
  // Size styles
  const containerSt = { width: elemSizeContain(game.ratio).width }
  const gameSt = {
    grid: `
      '.' 1fr
      'top' ${hInCqw(top.h)}
      'fieldBox' ${hInCqw(fieldBox.h)}
      'bottom' ${hInCqw(bottom.h)}
      '.' 1fr
       / 100%
    `,
  }
  const fieldBoxSt = { borderWidth: hInCqw(fieldBox.bdSz), height: hInCqw(fieldBox.h) }
  const comboFieldBoxSt = {
    borderWidth: hInCqw(comboFieldBox.bdSz),
    width: wInCqw(fieldBox.w),
    height: hInCqw(comboFieldBox.h),
    borderTop: 'none',
  }
  const comboFieldSt = {
    width: wInCqw(comboField.w),
    height: hInCqw(comboField.h),
  }
  const topSt = { height: hInCqw(top.h) }
  const topTitleBoxSt = { width: hInCqw(top.titleBox.w), height: hInCqw(top.titleBox.h) }
  const topTitleSt = { fontSize: hInCqw(top.title.h), opacity: nextGhost ? 0.5 : 1 }
  const bottomSt = {
    height: hInCqw(bottom.h),
    paddingTop: hInCqw(bottom.g),
    paddingBottom: hInCqw(bottom.g),
    gap: hInCqw(bottom.g),
  }
  const bottomItemSt = { gap: hInCqw(bottom.tx.g) }
  const titleSt = { fontSize: hInCqw(bottom.title.h) }
  const digitsSt = { fontSize: hInCqw(bottom.digit.h) }
  const controlsSt = { gap: hInCqw(gameControls.g) }
  const controlsIcSt = {
    width: hInCqw(gameControls.ic.sz),
    height: hInCqw(gameControls.ic.sz),
  }
  
  return (
    <>
      <div cn='h-full container-size' st={containerSt}>
        <div cn='sz-full grid isolate' st={gameSt}>
          
          <div cn='flex row w-full in-area-[top]' st={topSt}>
            
            <div cn='flexrc center2' st={topTitleBoxSt}>
              <div cn='txHudTitle z-[-1000]' st={topTitleSt}>
                NEXT
              </div>
            </div>
          </div>
          
          <div
            cn='flex col in-area-[fieldBox] pls-[end_stretch]
              rad-[1cqh] bd-cl-[var(--cl-tetris-field-bd)]'
            st={fieldBoxSt}
          />
          
          <div
            cn='flex col in-area-[top/top/fieldBox/fieldBox] pls-[end_stretch]
              rad-[1cqh] bd-cl-none'
            st={comboFieldBoxSt}
          >
            <TetrisField st={comboFieldSt} field={combinedField}/>
          </div>
          
          <div cn='grid cols-[1fr_1.2fr] in-area-[bottom] w-full' st={bottomSt}>
            
            <div cn='flexrc' st={bottomItemSt}>
              <div cn='txHudTitle' st={titleSt}>
                SCORE
              </div>
              <div>
                <div cn='txHudDigitsBold' st={digitsSt}>{score}</div>
              </div>
            </div>
            
            <div cn='flexrc' st={bottomItemSt}>
              <div cn='txHudTitle' st={titleSt}>
                HI-SCORE
              </div>
              <div>
                <div cn='txHudDigitsBold' st={digitsSt}>{hiScore}</div>
              </div>
            </div>
            
            <div cn='flexrc' st={bottomItemSt}>
              <div cn='txHudTitle' st={titleSt}>
                LEVEL
              </div>
              <div>
                <div cn='txHudDigitsBold' st={digitsSt}>{level}</div>
              </div>
            </div>
            
            <div cn='flexrc' st={bottomItemSt}>
              <div cn='txHudTitle' st={titleSt}>
                LINES
              </div>
              <div>
                <div cn='txHudDigitsBold' st={digitsSt}>{lines}</div>
              </div>
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
