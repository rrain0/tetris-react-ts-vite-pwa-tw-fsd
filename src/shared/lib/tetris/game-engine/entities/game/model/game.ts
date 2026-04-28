import { StepTimer } from '@@/lib/tetris/game-engine/shared/stepTimer.ts'
import { Tetris } from '@@/lib/tetris/tetris-engine/entities/tetris/model/tetris.ts'
import { getDocTime } from '@@/utils/dom/getDocTime.ts'
import { type Comparator, compareNumbers } from '@@/utils/js/compare.ts'
import { setOf } from '@@/utils/js/factory.ts'
import { type Cb, isdef } from '@@/utils/ts/ts.ts'



// TODO Add scores for T-Spins
// TODO May be add scores for combos
// TODO Tweak levels count
// TODO Tweak dependence of fallInterval, dropInterval, lockDelay on curr level

// TODO If raf doesn't run but somehow softDrop was started then ended, then run raf ???

export class Game {
  
  // Config - gameplay
  startLevel: count = 1
  linesToLvlUp: count = 10
  
  
  
  
  // Config - animations
  entryDelay: ms = 400
  
  fallIntervalForLvl1: ms = 1000
  softDropSpeedMult: number = 20
  
  // Delay after first left/right move
  // DAS - Delay After Shift
  moveLeftRightDas: ms = 167
  // Delay after any left/right move after second move
  // ARR - Auto Repeat Rate
  moveLeftRightArr: ms = 33
  
  dropIntervalForLvl1: ms = 10
  
  lockDelayLvl1: ms = 500
  lockDelayMaxPlayerActions: count = 15
  
  clearLinesDelay: ms = 200
  removeLinesDelay: ms = 400
  
  get lockDelay(): ms { return this.lockDelayLvl1 }
  get fallInterval(): ms { return this.fallIntervalForLvl1 * (20 - Math.min(20, this.level)) / 20 }
  get dropInterval(): ms { return this.dropIntervalForLvl1 * (20 - Math.min(20, this.level)) / 20 }
  get softDropInterval(): ms { return this.fallInterval / this.softDropSpeedMult }
  
  
  // Config - scores
  scoresHardDropPerBlock: count = 2
  scoresClear1LineLvl1: count = 100
  scoresClear2LinesLvl1: count = 300
  scoresClear3LinesLvl1: count = 500
  scoresClear4LinesLvl1: count = 1200
  scoresAllClearLvl1: count = 3000
  
  get scoresClear1Line() { return this.scoresClear1LineLvl1 * this.level }
  get scoresClear2Lines() { return this.scoresClear2LinesLvl1 * this.level }
  get scoresClear3Lines() { return this.scoresClear3LinesLvl1 * this.level }
  get scoresClear4Lines() { return this.scoresClear4LinesLvl1 * this.level }
  get scoresAllClear() { return this.scoresAllClearLvl1 * this.level }
  
  getScoresClearLines(cnt: count) {
    return {
      1: this.scoresClear1Line,
      2: this.scoresClear2Lines,
      3: this.scoresClear3Lines,
      4: this.scoresClear4Lines,
    }[cnt] ?? 0
  }
  
  
  
  // Progress
  hiScore: count = 0
  lines: count = 0
  score: count = 0
  level: count = this.startLevel
  tetris: Tetris = new Tetris()
  
  addScore(score: count) {
    this.score += score
    this.hiScore = Math.max(this.hiScore, this.score)
  }
  
  
  
  // Listeners
  listeners: Set<Cb> = setOf()
  onChange(listener: Cb) { this.listeners.add(listener) }
  offChange(listener: Cb) { this.listeners.delete(listener) }
  notifyChange() { for (const l of this.listeners) l() }
  
  
  
  // Running state & actions
  gameOver = false
  pausedAt: ms | undefined = 0
  rafPaused = true
  
  // TODO
  animating: GameAnimation | undefined
  lastActionAt: ms = 0
  
  animations: Animations = {
    spawnNextPiece: undefined,
    clearLines: undefined,
    hardDrop: undefined,
    
    lockDelay: undefined,
    
    softDrop: undefined,
    
    fall: undefined,
    
    moveLeft: undefined,
    moveRight: undefined,
  }
  
  forbidPlayerMove = false
  allowMove = false
  isSoftDrop = false
  
  // TODO
  softDropping: GameAnimation | undefined
  
  // TODO
  movingLeft: GameAnimation | undefined
  movingRight: GameAnimation | undefined
  
  // TODO
  playerActions: PlayerActionsQueue = []
  playerActionsCnt: count = 0
  lastPlayerActionAt: ms = 0
  
  
  nextAnimation(animation: GameAnimation | undefined) {
    this.allowMove = false
    this.animating = animation
  }
  isPause(): this is { get pausedAt(): ms; set pausedAt(pausedAt: ms | undefined) } {
    return isdef(this.pausedAt)
  }
  get isPlaying() { return !this.isPause() && !this.gameOver }
  
  get allowPlayerAction() {
    return !this.isPause() && this.allowMove && !this.gameOver
  }
  
  setTime(time: ms) { this.lastActionAt = time }
  elapsed(to: ms) { return to - this.lastActionAt }
  advance(time: ms) { this.lastActionAt += time }
  tickFor(advance: ms, now: ms): boolean {
    if (this.lastActionAt + advance <= now) { this.advance(advance); return true }
    return false
  }
  tickTo(to: ms, now: ms): boolean {
    if (to <= now) { this.setTime(to); return true }
    return false
  }
  
  resume() {
    if (this.isPause() && !this.gameOver) {
      const pausedFor = getDocTime() - this.pausedAt
      this.advance(pausedFor)
      this.pausedAt = undefined
      if (this.rafPaused) {
        this.rafPaused = false
        requestAnimationFrame(this.run)
      }
    }
  }
  pause() { this.pausedAt = getDocTime() }
  
  
  
  // Lifecycle methods
  run = (time: ms) => {
    if (!this.isPlaying) { this.rafPaused = true; return }
    
    const actions = this.playerActions
    actions.sort(playerActionsComparator)
    
    const dPlayerActionsCnt = this.playerActionsCnt
    this.playerActionsCnt = 0
    
    let changed = !!dPlayerActionsCnt
    let i = 0
    for (; i <= actions.length; i++) {
      const action = actions[i]
      const { type, actionAt = time } = action ?? { }
      const t = Math.min(time, actionAt)
      
      
      
      if (type === 'startMoveLeft') {
        if (!this.movingLeft) this.movingLeft = moveLeftAnimation(this, actionAt)
      }
      else if (type === 'stopMoveLeft') {
        this.movingLeft = undefined
      }
      else if (type === 'startMoveRight') {
        if (!this.movingRight) this.movingRight = moveRightAnimation(this, actionAt)
      }
      else if (type === 'stopMoveRight') {
        this.movingRight = undefined
      }
      else if (type === 'startSoftDrop') {
        this.softDropping = softDropAnimation(this, actionAt)
      }
      else if (type === 'stopSoftDrop') {
        this.softDropping = undefined
      }
      
      
      if (!this.animating) this.nextAnimation(fallAnimation(this, t))
      while (this.animating) {
        const result = this.animating.next({ time: t, dPlayerActionsCnt })
        changed ||= result.value.changed
        if (!result.done) break
        this.nextAnimation(result.value.next)
      }
      
      while (this.movingLeft) {
        const result = this.movingLeft.next({ time: t, dPlayerActionsCnt })
        changed ||= result.value.changed
        if (!result.done) break
        this.movingLeft = undefined
      }
      while (this.movingRight) {
        const result = this.movingRight.next({ time: t, dPlayerActionsCnt })
        changed ||= result.value.changed
        if (!result.done) break
        this.movingRight = undefined
      }
      
      
      
      
      
      if (!action || actionAt >= time) break
    }
    actions.splice(0, i)
    
    if (changed) this.notifyChange()
    requestAnimationFrame(this.run)
  }
  
  
  
  
  
  // Player actions
  startMoveLeft() {
    this.playerActions.push({ type: 'startMoveLeft', actionAt: getDocTime() })
  }
  stopMoveLeft() {
    this.playerActions.push({ type: 'stopMoveLeft', actionAt: getDocTime() })
  }
  startMoveRight() {
    this.playerActions.push({ type: 'startMoveRight', actionAt: getDocTime() })
  }
  stopMoveRight() {
    this.playerActions.push({ type: 'stopMoveRight', actionAt: getDocTime() })
  }
  startSoftDrop() {
    this.playerActions.push({ type: 'startSoftDrop', actionAt: getDocTime() })
  }
  stopSoftDrop() {
    this.playerActions.push({ type: 'stopSoftDrop', actionAt: getDocTime() })
  }
  
  
  
  // TODO how to process them?
  // Player actions
  // TODO
  processPlayerAction(moved: boolean) {
    if (moved) {
      this.lastPlayerActionAt = getDocTime()
      this.playerActionsCnt++
    }
  }
  moveUp() {
    if (!this.allowPlayerAction) return
    const moved = this.tetris.moveUp()
    if (moved) this.animating = fallAnimation(this, getDocTime())
    this.processPlayerAction(moved)
  }
  rotateLeft() {
    if (!this.allowPlayerAction) return
    const moved = this.tetris.rotateLeft()
    this.processPlayerAction(moved)
  }
  rotateRight() {
    if (!this.allowPlayerAction) return
    const moved = this.tetris.rotateRight()
    this.processPlayerAction(moved)
  }
  hardDrop() {
    if (!this.allowPlayerAction) return
    const time = getDocTime()
    this.setTime(time)
    this.nextAnimation(hardDropAnimation(this, time))
  }
  
}



// Animations
function *fallAnimation(game: Game, time: ms): GameAnimation {
  game.allowMove = true
  const { fallInterval } = game
  const multisteps = [{ step: fallInterval }]
  const lastActionAt = StepTimer.of(time, multisteps)
  
  let changed = false
  
  const onChange = (time: number) => {
    game.lastActionAt = time
    changed = true
  }
  
  do {
    const prevLastActionAt = lastActionAt.copy()
    const { time: t, dCnt } = lastActionAt.forwardTo(time)
    if (dCnt) {
      const realDCnt = game.tetris.fallBy(dCnt)
      if (realDCnt) {
        const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
        onChange(t)
      }
    }
    
    const canFall = game.tetris.canMoveDown()
    if (!canFall) return { changed, next: lockDelayAnimation(game, time) }
    
    ;({ time } = yield { changed })
  } while (true)
}

function *softDropAnimation(game: Game, time: ms): GameAnimation {
  game.allowMove = true
  const { softDropInterval } = game
  const multisteps = [{ step: 0, cnt: 1 }, { step: softDropInterval }]
  const lastActionAt = StepTimer.of(time, multisteps)
  
  let changed = false
  
  const onChange = (time: number) => {
    game.lastActionAt = time
    changed = true
  }
  
  do {
    const prevLastActionAt = lastActionAt.copy()
    const { time: t, dCnt } = lastActionAt.forwardTo(time)
    if (dCnt) {
      const realDCnt = game.tetris.fallBy(dCnt)
      if (realDCnt) {
        const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
        onChange(t)
      }
    }
    
    const canFall = game.tetris.canMoveDown()
    if (!canFall) return { changed, next: lockDelayAnimation(game, time) }
    
    ;({ time } = yield { changed })
  } while (true)
}

// TODO Check it works correctly
function *lockDelayAnimation(game: Game, time: ms): GameAnimation {
  game.allowMove = true
  let playerActionsCnt = 0
  let dPlayerActionsCnt = 0
  do {
    const { lockDelay, lockDelayMaxPlayerActions } = game
    
    const anyLastActionAt = Math.max(game.lastActionAt, game.lastPlayerActionAt)
    game.setTime(anyLastActionAt)
    
    const fallen = game.tetris.moveDown()
    if (fallen) return { changed: true, next: fallAnimation(game, time) }
    
    const locked = game.elapsed(time) >= lockDelay ||
      // TODO
      playerActionsCnt >= lockDelayMaxPlayerActions
    if (locked) {
      game.tetris.lockCurrentPiece()
      game.advance(lockDelay)
      return { changed: false, next: clearLinesAnimation(game, time) }
    }
    
    // TODO
    const playerMadeMove = !!dPlayerActionsCnt
    if (playerMadeMove) {
      // TODO
      game.setTime(time)
    }
    
    ;({ time, dPlayerActionsCnt } = yield { changed: false })
    playerActionsCnt += dPlayerActionsCnt
  } while (true)
}

function *moveLeftAnimation(game: Game, time: ms): GameAnimation {
  const { moveLeftRightDas, moveLeftRightArr } = game
  const multisteps = [
    { step: 0, cnt: 1 },
    { step: moveLeftRightDas, cnt: 1 },
    { step: moveLeftRightArr },
  ]
  const lastActionAt = StepTimer.of(time, multisteps)
  
  let changed = false
  
  const onChange = (time: number, cnt: count) => {
    game.lastPlayerActionAt = time
    game.playerActionsCnt += cnt
    changed = true
  }
  
  
  do {
    const { allowMove } = game
    if (allowMove) {
      const prevLastActionAt = lastActionAt.copy()
      const { time: t, dCnt } = lastActionAt.forwardTo(time)
      if (dCnt) {
        let realDCnt = 0
        for (; realDCnt < dCnt; realDCnt++) {
          // TODO make field method to move at once
          if (!game.tetris.moveLeft()) break
        }
        if (realDCnt) {
          const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
          onChange(t, dCnt)
        }
      }
    }
    ;({ time } = yield { changed }); changed = false
  } while (true)
}

function *moveRightAnimation(game: Game, time: ms): GameAnimation {
  const { moveLeftRightDas, moveLeftRightArr } = game
  const multisteps = [
    { step: 0, cnt: 1 },
    { step: moveLeftRightDas, cnt: 1 },
    { step: moveLeftRightArr },
  ]
  const lastActionAt = StepTimer.of(time, multisteps)
  
  let changed = false
  
  const onChange = (time: number, cnt: count) => {
    game.lastPlayerActionAt = time
    game.playerActionsCnt += cnt
    changed = true
  }
  
  do {
    const { allowMove } = game
    if (allowMove) {
      const prevLastActionAt = lastActionAt.copy()
      const { time: t, dCnt } = lastActionAt.forwardTo(time)
      if (dCnt) {
        let realDCnt = 0
        for (; realDCnt < dCnt; realDCnt++) {
          // TODO make field method to move at once
          if (!game.tetris.moveRight()) break
        }
        if (realDCnt) {
          const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
          onChange(t, dCnt)
        }
      }
    }
    ;({ time } = yield { changed }); changed = false
  } while (true)
}

function *hardDropAnimation(game: Game, time: ms): GameAnimation {
  do {
    const { dropInterval, scoresHardDropPerBlock } = game
    
    const fallDepth = Math.floor(game.elapsed(time) / dropInterval)
    game.advance(fallDepth * dropInterval)
    
    const fallen = game.tetris.fallBy(fallDepth)
    game.addScore(fallen * scoresHardDropPerBlock)
    const changed = !!fallen
    
    if (!game.tetris.canMoveDown()) {
      game.tetris.lockCurrentPiece()
      return { changed, next: clearLinesAnimation(game, time) }
    }
    ;({ time } = yield { changed })
  } while (true)
}

function *clearLinesAnimation(game: Game, time: ms): GameAnimation {
  const lines = game.tetris.getFullLines()
  if (!lines.length) return { changed: false, next: spawnNextPieceAnimation(game, time) }
  
  let changed = false
  do {
    const { clearLinesDelay, linesToLvlUp } = game
    
    if (game.tickFor(clearLinesDelay, time)) {
      game.tetris.clearLines(lines)
      const prevLines = game.lines
      
      game.lines += lines.length
      
      game.level += Math.floor(game.lines / linesToLvlUp) - Math.floor(prevLines / linesToLvlUp)
      
      game.addScore(game.getScoresClearLines(lines.length))
      if (game.tetris.field.bottomEmpty) game.addScore(game.scoresAllClear)
      
      changed = !!lines.length
      break
    }
    ;({ time } = yield { changed }); changed = false
  } while (true)
  
  do {
    const { removeLinesDelay } = game
    if (game.tickFor(removeLinesDelay, time)) {
      game.tetris.removeLines(lines)
      return { changed: !!lines.length, next: spawnNextPieceAnimation(game, time) }
    }
    ;({ time } = yield { changed }); changed = false
  } while (true)
}

function *spawnNextPieceAnimation(game: Game, time: ms): GameAnimation {
  do {
    const { entryDelay } = game
    if (game.tickFor(entryDelay, time)) break
    ;({ time } = yield { changed: false })
  } while (true)
  
  const spawned = game.tetris.spawnNextPiece()
  if (!spawned) {
    game.gameOver = true
    return { changed: false }
  }
  
  return { changed: true, next: fallAnimation(game, time) }
}




export type PlayerActionType =
  | 'startMoveLeft'
  | 'stopMoveLeft'
  | 'startMoveRight'
  | 'stopMoveRight'
  | 'startSoftDrop'
  | 'stopSoftDrop'
  
  | 'moveUp'
  | 'rotateLeft'
  | 'rotateRight'
  | 'hardDrop'

export type PlayerAction = { type: PlayerActionType, actionAt: ms }
export type PlayerActionsQueue = PlayerAction[]
const playerActionsComparator: Comparator<PlayerAction> = (a, b) => {
  return compareNumbers(a.actionAt, b.actionAt)
}



export type GameAnimationParams = {
  time: ms
  dPlayerActionsCnt: count
}
export type GameAnimationNext = {
  changed: boolean // Is game state changed
}
export type GameAnimationResult = {
  changed: boolean // Is game state changed
  next?: GameAnimation | undefined // Next animation to run
}
export type GameAnimation = IteratorObject<
  GameAnimationNext, // yield <value>
  GameAnimationResult, // return <value>
  GameAnimationParams // <value> = yield; iterator.next(<value>)
> | undefined



export type Animations = {
  spawnNextPiece: GameAnimation | undefined
  clearLines: GameAnimation | undefined
  hardDrop: GameAnimation | undefined
  
  lockDelay: GameAnimation | undefined
  
  softDrop: GameAnimation | undefined
  
  fall: GameAnimation | undefined
  
  moveLeft: GameAnimation | undefined
  moveRight: GameAnimation | undefined
}
