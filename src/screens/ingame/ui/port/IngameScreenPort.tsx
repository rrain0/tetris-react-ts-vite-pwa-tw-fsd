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
    blockSz,
    fieldBoxBdSz, fieldBoxW, fieldBoxH,
    fullFieldBoxH,
    topH,
    topTitleBoxH, topTitleBoxW, topTitleH,
    bottomG, bottomH, titleH, digitH, bottomTxG,
    controlsIcSz, controlsG, controlsW,
    gameW, gameH, gameRatio,
    hOfCqw,
  } = ingameScreenPortSizes()
  
  // Size styles
  const containerSt = { width: elemSizeContain(gameRatio).width, height: '100%' }
  const gameSt = {
    grid: `
      'controls' 1fr
      'top' ${hOfCqw(topH)}
      'fieldBox' ${hOfCqw(fieldBoxH)}
      'bottom' ${hOfCqw(bottomH)}
      '.' 1fr
       / 100%
    `,
  }
  const fieldBoxSt = { borderWidth: hOfCqw(fieldBoxBdSz), height: hOfCqw(fieldBoxH) }
  const fieldSt = {
    borderWidth: hOfCqw(fieldBoxBdSz),
    height: hOfCqw(fullFieldBoxH),
    borderTop: 'none',
  }
  const topSt = { height: hOfCqw(topH) }
  const topTitleBoxSt = { width: hOfCqw(topTitleBoxW), height: hOfCqw(topTitleBoxH) }
  const topTitleSt = { fontSize: hOfCqw(topTitleH), opacity: nextGhost ? 0.5 : 1 }
  const bottomSt = {
    height: hOfCqw(bottomH),
    paddingTop: hOfCqw(bottomG),
    paddingBottom: hOfCqw(bottomG),
    gap: hOfCqw(bottomG),
  }
  const bottomItemSt = { gap: hOfCqw(bottomTxG) }
  const titleSt = { fontSize: hOfCqw(titleH) }
  const digitsSt = { fontSize: hOfCqw(digitH) }
  const controlsSt = { gap: hOfCqw(controlsG) }
  const controlsIcSt = { width: hOfCqw(controlsIcSz), height: hOfCqw(controlsIcSz) }
  
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
            cn='flex col in-area-[fieldBox] jus-stretch
              bd-cl-[var(--cl-tetris-field-bd)] rad-[1cqh]'
            st={fieldBoxSt}
          />
          
          <div
            cn='flex col in-area-[top/top/fieldBox/fieldBox] pls-[end_center]
              bd-cl-none rad-[1cqh]'
            st={fieldSt}
          >
            <TetrisField cn='h-full' field={combinedField}/>
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
