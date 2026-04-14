import type { Game } from '@@/lib/tetris-engine/entities/game/model/game.ts'
import { elemSizeContain } from '@@/utils/css/elemSizeContain.ts'
import { ingameScreenPortSizes } from '@/screens/ingame/ui/port/ingameScreenPortSizes.ts'
import TetrisField from '@/widgets/tetris-field/ui/TetrisField.tsx'
import type { IngameStats } from '@/screens/ingame/model/ingameScreen.ts'
import FullscreenIc from '@@/assets/ic/svg/ui/fullscreen.svg?react'
import PauseIc from '@@/assets/ic/svg/ui/pause.svg?react'



export type IngameScreenPortProps = IngameStats & {
  game: Game
}

export default function IngameScreenPort(props: IngameScreenPortProps) {
  const { game, hiScore, score, level, lines } = props
  
  const combinedField = game.renderCombinedField()
  
  const {
    blockSz,
    fieldBoxBdSz, fieldBoxW, fieldBoxH,
    fullFieldBoxH,
    topH, topTitleH, topTitleMl,
    bottomG, bottomH, titleH, digitH, bottomTxG,
    icSz, icsG, icsW,
    gameW, gameH, gameRatio,
    h,
  } = ingameScreenPortSizes()
  
  // Size styles
  const containerSt = { width: elemSizeContain(gameRatio).width }
  const gameSt = {
    grid: `
      'ics' 1fr
      'top' ${h(topH)}
      'fieldBox' ${h(fieldBoxH)}
      'bottom' ${h(bottomH)}
      '.' 1fr
       / 100%
    `,
  }
  const fieldBoxSt = { borderWidth: h(fieldBoxBdSz), height: h(fieldBoxH) }
  const fieldSt = { borderWidth: h(fieldBoxBdSz), height: h(fullFieldBoxH), borderTop: 'none' }
  const topSt = { height: h(topH) }
  const topTitleSt = { marginLeft: h(topTitleMl), fontSize: h(topTitleH) }
  const bottomSt = {
    height: h(bottomH), paddingTop: h(bottomG), paddingBottom: h(bottomG), gap: h(bottomG),
  }
  const bottomItemSt = { gap: h(bottomTxG) }
  const titleSt = { fontSize: h(titleH) }
  const digitsSt = { fontSize: h(digitH) }
  const icsSt = { gap: h(icsG) }
  const icSt = { width: h(icSz), height: h(icSz) }
  
  return (
    <>
      
      <div cn='h-full container-size' st={containerSt}>
        <div cn='sz-full grid' st={gameSt}>
          
          <div cn='flex row start-end pls-[start_end]' st={icsSt}>
            <div cn='flex col center2' st={icSt}>
              <FullscreenIc cn={`sz-full ${icCn}`}/>
            </div>
            <div cn='flex col center2' st={icSt}>
              <PauseIc cn={`sz-full ${icCn}`}/>
            </div>
          </div>
          
          <div cn='flexrc w-full in-area-[top]' st={topSt}>
            <div cn='txHudTitle' st={topTitleSt}>
              NEXT
            </div>
          </div>
          
          <div cn='flex col in-area-[fieldBox] bd-cl-[var(--cl-tetris-field-bd)] rad-[1cqh]'
            st={fieldBoxSt}
          />
          
          <div cn='flex col in-area-[top/top/fieldBox/fieldBox] als-end w-ct bd-cl-none rad-[1cqh]'
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
    </>
  )
}



// Content styles
const icCn = 'cl-[var(--cl-hud-tx)] svg-curr-cl'
