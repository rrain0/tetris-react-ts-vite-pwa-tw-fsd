import { gameConfig } from '@@/lib/tetris-engine/entities/game/lib/gameConfig.ts'
import { Tetris } from '@@/lib/tetris-engine/entities/tetris/model/tetris.ts'



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
  
}
