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
  
  const blockSz = 1.0
  
  const fieldBdW = 0.16
  const fieldW = fieldBdW + 10 * blockSz + fieldBdW
  const fieldH = fieldBdW + 20 * blockSz + fieldBdW
  
  const sideW = 6 * blockSz
  const sideG = 0.35
  const nextW = nextField.cols * blockSz
  const titleH = 0.8
  const digitH = 0.9
  
  const icSz = 1
  const icsG = 0.3
  const icsW = icSz + icsG + icSz
  
  const gameG = 0.5
  const gameW = icsW + gameG + fieldW + gameG + sideW + gameG + icsW
  const gameH = fieldH
  const gameRatio = gameW / gameH
  
  const w = (w: number) => `${w / gameW * 100 * gameRatio}cqh`
  
  const containerSt = { height: elemSizeContain(gameRatio).height }
  const gameSt = {
    gap: w(gameG),
    gridTemplateColumns: `
      minmax(${w(icsW)}, 1fr) ${w(sideW)}
      ${w(fieldW)}
      ${w(sideW)} minmax(${w(icsW)}, 1fr)
    `,
  }
  const fieldSt = { borderWidth: w(fieldBdW), width: w(fieldW) }
  const sideSt = { width: w(sideW), gap: w(sideG) }
  const titleSt = { fontSize: w(titleH) }
  const digitsSt = { fontSize: w(digitH) }
  const nextSt = { width: w(nextW) }
  const icsSt = { gap: w(icsG) }
  const icSt = { width: w(icSz), height: w(icSz) }
  
  return (
    <div cn='w-full container-size' st={containerSt}>
      <div cn='sz-full grid row' st={gameSt}>
        
        <div/>
        
        <div/>
        
        <div cn='flex col w-ct bd-cl-[var(--cl-tetris-field-bd)] rad-[1cqh]' st={fieldSt}>
          <TetrisField cn='w-full' field={field}/>
        </div>
        
        <div cn='flex col cl-[var(--cl-hud-tx)]' st={sideSt}>
          
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
            <TetrisField st={nextSt}
              field={nextField}
            />
          </div>
          
        </div>
        
        <div cn='flex row start-end cl-[var(--cl-hud-tx)]' st={icsSt}>
          <div cn='flex col center2' st={icSt}>
            <FullscreenIc cn='sz-full svg-curr-cl'/>
          </div>
          <div cn='flex col center2' st={icSt}>
            <PauseIc cn='sz-full svg-curr-cl'/>
          </div>
        </div>
      
      </div>
    </div>
  )
}



const titleCn = 'tx-wt-[600] tx-h-[1]'
const digitsCn = 'tx-f-[DSEG7Mod7ClassicMini] tx-wt-[bold] tx-h-[1] tx-sp-[normal]'
