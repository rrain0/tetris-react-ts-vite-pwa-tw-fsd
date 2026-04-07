import type { Game } from '@lib/tetris-engine/entities/game/model/game.ts'
import { elemSizeContain } from '@utils/css/elemSizeContain.ts'
import TetrisField from 'widgets/tetris-field/ui/TetrisField.tsx'
import FullscreenIc from '@assets/ic/svg/ui/fullscreen.svg?react'
import PauseIc from '@assets/ic/svg/ui/pause.svg?react'



export type IngameScreenLandProps = {
  game: Game
}

export default function IngameScreenLand({ game }: IngameScreenLandProps) {
  const field = game.renderField()
  const nextField = game.renderNextField()
  
  const focusOnMount = { ref: (elem: HTMLElement | null) => elem?.focus() }
  
  const bSz = 1.0 // block size
  const p = 0.5 * bSz
  const bdW = 0.16
  const fieldW = 10 * bSz
  const fieldH = 20 * bSz
  const sideW = 6 * bSz
  const sideG = 0.35 * bSz
  const nextW = 4 * bSz
  const titleSz = 0.8 * bSz
  const digitsSz = 0.9 * bSz
  const icSz = 1.3 * bSz
  const icG = 0.3 * bSz
  
  const totalW = bdW + fieldW + bdW + p + sideW
  const totalH = bdW + fieldH + bdW
  const ratio = totalW / totalH
  const cqw = (w: number) => `${w / totalW * 100}cqw`
  
  const titleSt = { fontSize: cqw(titleSz) }
  const digitsSt = { fontSize: cqw(digitsSz) }
  const icSt = { width: cqw(icSz), height: cqw(icSz) }
  
  return (
    <div cn='container-size' st={elemSizeContain(ratio)}>
      <div cn='sz-full grid row' st={{ gap: cqw(p) }}>
        
        <div cn='flex col w-ct bd-cl-[var(--cl-tetris-field-bd)] rad-[1.25cqw]'
          st={{ borderWidth: cqw(bdW) }}
        >
          <TetrisField st={{ width: cqw(fieldW) }}
            field={field}
            tabIndex={-1}
            {...focusOnMount}
          />
        </div>
        
        <div cn='flex col cl-[var(--cl-hud-tx)]' st={{ width: cqw(sideW) }}>
          
          <div cn='flex col grow between' st={{ gap: cqw(sideG) }}>
            
            <div cn='flex col' st={{ gap: cqw(sideG) }}>
              <div cn={titleCn} st={titleSt}>
                HI-SCORE
              </div>
              <div cn='flex col end'>
                <div cn={digitsCn} st={digitsSt}>194638</div>
              </div>
              
              <div cn={titleCn} st={titleSt}>
                SCORE
              </div>
              <div cn='flex col end'>
                <div cn={digitsCn} st={digitsSt}>1666</div>
              </div>
              
              <div cn={titleCn} st={titleSt}>
                LEVEL
              </div>
              <div cn='flex col end'>
                <div cn={digitsCn} st={digitsSt}>12</div>
              </div>
              
              <div cn={titleCn} st={titleSt}>
                LINES
              </div>
              <div cn='flex col end'>
                <div cn={digitsCn} st={digitsSt}>57</div>
              </div>
              
              <div cn={titleCn} st={titleSt}>
                NEXT
              </div>
              <div cn='flex col end'>
                <TetrisField st={{ width: cqw(nextW) }}
                  field={nextField}
                />
              </div>
            </div>
            
            <div cn='flex col end'>
              <div cn='flex row center-end' st={{ gap: cqw(icG) }}>
                <div cn='flex col center2' st={icSt}>
                  <FullscreenIc cn='sz-full svg-curr-cl'/>
                </div>
                <div cn='flex col center2 p-[1]' st={icSt}>
                  <PauseIc cn='sz-full svg-curr-cl'/>
                </div>
              </div>
            </div>
          
          </div>
        
        </div>
      
      </div>
    </div>
  )
}



const titleCn = 'tx-wt-[600] tx-h-[1]'
const digitsCn = 'tx-f-[DSEG7Mod7ClassicMini] tx-wt-[bold] tx-h-[1] tx-sp-[normal]'
