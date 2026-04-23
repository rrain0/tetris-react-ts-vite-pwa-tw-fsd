import { gameConfig } from '@@/lib/tetris/tetris-engine/entities/game/lib/gameConfig.ts'
import { Tetris } from '@@/lib/tetris/tetris-engine/entities/tetris/model/tetris.ts'
import { setOf } from '@@/utils/react/state/state.ts'
import type { Cb } from '@@/utils/ts/ts.ts'



// Эта штука будет отвечать за анимации + здесь будет таймер на автопадение

export class Game {
  
  // Game config
  linesToLvlUp: number = gameConfig.linesToLvlUp
  startLevel: number = gameConfig.startLevel
  
  // Game progress
  hiScore = 0
  lines = 0
  score = 0
  level = 0
  
  tetris: Tetris = new Tetris()
  
  intervalId: any
  
  listeners: Set<Cb> = setOf()
  
  onAutoChange(listener: Cb) { this.listeners.add(listener) }
  offAutoChange(listener: Cb) { this.listeners.delete(listener) }
  notifyAutoChange() { for (const l of this.listeners) l() }
  
  resume() {
    if (!this.intervalId) this.intervalId = setInterval(() => {
      this.tetris.moveCurrentPieceDown()
      
      // TODO check lock and make lock delay
      
      this.notifyAutoChange()
    }, 1000)
  }
  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }
  
}
