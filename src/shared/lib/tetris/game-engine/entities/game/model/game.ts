import { StepTimer } from '@@/lib/tetris/game-engine/shared/stepTimer.ts'
import { Tetris } from '@@/lib/tetris/tetris-engine/entities/tetris/model/tetris.ts'
import { getDocTime } from '@@/utils/dom/getDocTime.ts'
import { type Comparator, compareNumbers } from '@@/utils/js/compare.ts'
import { setOf } from '@@/utils/js/factory.ts'
import { type Cb, isdef, type PartDefined, type RecordUndef } from '@@/utils/ts/ts.ts'



// TODO Add scores for T-Spins
// TODO May be add scores for combos
// TODO Tweak levels count
// TODO Tweak dependence of fallInterval, dropInterval, lockDelay on curr level

export class Game {
  
  // Config - gameplay
  startLevel: count = 1
  linesToLvlUp: count = 10
  
  
  
  
  // Config - animations
  entryDelay: ms = 400
  
  fallIntervalForLvl1: ms = 1000
  softDropSpeedMult: number = 20
  hardDropIntervalForLvl1: ms = 10
  
  // Delay after first left/right move
  // DAS - Delay After Shift
  moveDas: ms = 167
  // Delay after any left/right move after second move
  // ARR - Auto Repeat Rate
  moveArr: ms = 33
  
  lockDelayLvl1: ms = 500
  lockDelayMaxPlayerActions: count = 15
  
  clearLinesDelay: ms = 200
  removeLinesDelay: ms = 400
  
  get lockDelay(): ms { return this.lockDelayLvl1 }
  get fallInterval(): ms {
    return this.fallIntervalForLvl1 * (20 - Math.min(20, this.level)) / 20
  }
  get hardDropInterval(): ms {
    return this.hardDropIntervalForLvl1 * (20 - Math.min(20, this.level)) / 20
  }
  get softDropInterval(): ms { return this.fallInterval / this.softDropSpeedMult }
  
  
  
  
  // Config - scores
  scoresSoftDropPerBlock: count = 1
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
  
  
  
  
  // Running state
  gameOver = false
  pausedAt: ms | undefined = 0
  rafPaused = true
  
  // TODO
  lastActionAt: ms = 0
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
  
  // TODO
  playerActions: PlayerActionsQueue = []
  playerActionsCnt: count = 0
  lastPlayerActionAt: ms = 0
  
  animations: GameAnimations = {
    spawnNextPiece: undefined,
    clearLines: undefined,
    hardDrop: undefined,
    
    lockDelay: undefined,
    
    moveUp: undefined,
    softDrop: undefined,
    
    fall: undefined,
    
    moveLeft: undefined,
    moveRight: undefined,
    rotateLeft: undefined,
    rotateRight: undefined,
  }
  
  isPause(): this is { get pausedAt(): ms; set pausedAt(pausedAt: ms | undefined) } {
    return isdef(this.pausedAt)
  }
  get isPlaying() {
    return !this.isPause() && !this.gameOver
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
  pause() {
    this.pausedAt = getDocTime()
  }
  
  
  
  
  // Game loop
  run = (time: ms) => {
    if (!this.isPlaying) { this.rafPaused = true; return }
    
    const actions = this.playerActions
    actions.sort(playerActionsComparator)
    
    const dPlayerActionsCnt = this.playerActionsCnt
    this.playerActionsCnt = 0
    
    let changed = !!dPlayerActionsCnt
    let i = 0, isLastIteration = false
    for (; i <= actions.length && !isLastIteration; i++) {
      const action = actions[i]
      const { type, actionAt = time } = action ?? { }
      isLastIteration = !action || actionAt >= time
      const t = Math.min(time, actionAt)
      
      
      const anims = this.animations
      
      
      const isExclusive = anims.hardDrop || anims.clearLines || anims.spawnNextPiece
      const canFall = !isExclusive && !anims.lockDelay && !anims.softDrop && !anims.moveUp
      const canPlayerMove = !isExclusive
      
      const animParams = { time: t, dPlayerActionsCnt, canPlayerMove }
      
      if (canFall) anims.fall ??= fallAnimation(this, animParams)
      else anims.fall = undefined
      
      
      
      
      if (type === 'startMoveLeft') {
        anims.moveLeft ??= moveLeftAnimation(this, animParams)
      }
      else if (type === 'stopMoveLeft') {
        anims.moveLeft = undefined
      }
      else if (type === 'startMoveRight') {
        anims.moveRight ??= moveRightAnimation(this, animParams)
      }
      else if (type === 'stopMoveRight') {
        anims.moveRight = undefined
      }
      else if (type === 'startRotateLeft') {
        anims.rotateLeft ??= rotateLeftAnimation(this, animParams)
      }
      else if (type === 'stopRotateLeft') {
        anims.rotateLeft = undefined
      }
      else if (type === 'startRotateRight') {
        anims.rotateRight ??= rotateRightAnimation(this, animParams)
      }
      else if (type === 'stopRotateRight') {
        anims.rotateRight = undefined
      }
      else if (type === 'startSoftDrop') {
        anims.softDrop ??= softDropAnimation(this, animParams)
      }
      else if (type === 'stopSoftDrop') {
        anims.softDrop = undefined
      }
      else if (type === 'startMoveUp') {
        anims.moveUp ??= moveUpAnimation(this, animParams)
      }
      else if (type === 'stopMoveUp') {
        anims.moveUp = undefined
      }
      else if (type === 'startHardDrop') {
        anims.hardDrop ??= hardDropAnimation(this, animParams)
      }
      
      
      
      
      for (const name of animationNamesOrdered) {
        while (anims[name]) {
          const result = anims[name].next(animParams)
          changed ||= result.value.changed
          if (!result.done) break; else anims[name] = undefined
          Object.assign(anims, result.value.next)
        }
      }
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
  startRotateLeft() {
    this.playerActions.push({ type: 'startRotateLeft', actionAt: getDocTime() })
  }
  stopRotateLeft() {
    this.playerActions.push({ type: 'stopRotateLeft', actionAt: getDocTime() })
  }
  startRotateRight() {
    this.playerActions.push({ type: 'startRotateRight', actionAt: getDocTime() })
  }
  stopRotateRight() {
    this.playerActions.push({ type: 'stopRotateRight', actionAt: getDocTime() })
  }
  startMoveUp() {
    this.playerActions.push({ type: 'startMoveUp', actionAt: getDocTime() })
  }
  stopMoveUp() {
    this.playerActions.push({ type: 'stopMoveUp', actionAt: getDocTime() })
  }
  startSoftDrop() {
    this.playerActions.push({ type: 'startSoftDrop', actionAt: getDocTime() })
  }
  stopSoftDrop() {
    this.playerActions.push({ type: 'stopSoftDrop', actionAt: getDocTime() })
  }
  startHardDrop() {
    this.playerActions.push({ type: 'startHardDrop', actionAt: getDocTime() })
  }
  
}




// Animations
function *fallAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time } = params
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
    if (!canFall) return {
      changed,
      next: { lockDelay: lockDelayAnimation(game, params) },
    }
    
    params = yield { changed }; ({ time } = params)
    changed = false
  } while (true)
}

function *moveUpAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time, canPlayerMove } = params
  const { moveDas, moveArr } = game
  const multisteps = [
    { step: 0, cnt: 1 },
    { step: moveDas, cnt: 1 },
    { step: moveArr },
  ]
  const lastActionAt = StepTimer.of(time, multisteps)
  
  let changed = false
  
  const onChange = (time: number, cnt: count) => {
    game.lastPlayerActionAt = time
    game.playerActionsCnt += cnt
    changed = true
  }
  
  do {
    if (canPlayerMove) {
      const prevLastActionAt = lastActionAt.copy()
      const { time: t, dCnt } = lastActionAt.forwardTo(time)
      if (dCnt) {
        let realDCnt = 0
        for (; realDCnt < dCnt; realDCnt++) {
          // TODO make field method to move by count at once
          if (!game.tetris.moveUp()) break
        }
        if (realDCnt) {
          const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
          onChange(t, dCnt)
        }
      }
      
      const canFall = game.tetris.canMoveDown()
      if (!canFall) return {
        changed,
        next: { lockDelay: lockDelayAnimation(game, params) },
      }
    }
    params = yield { changed }; ({ time, canPlayerMove } = params)
    changed = false
  } while (true)
}

function *softDropAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time } = params
  const { softDropInterval, scoresSoftDropPerBlock } = game
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
        game.addScore(realDCnt * scoresSoftDropPerBlock)
        const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
        onChange(t)
      }
    }
    
    const canFall = game.tetris.canMoveDown()
    if (!canFall) return {
      changed,
      next: { lockDelay: lockDelayAnimation(game, params) },
    }
    
    params = yield { changed }; ({ time } = params)
    changed = false
  } while (true)
}

// TODO Check it works correctly
function *lockDelayAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time } = params
  let playerActionsCnt = 0
  let dPlayerActionsCnt = 0
  do {
    const { lockDelay, lockDelayMaxPlayerActions } = game
    
    const anyLastActionAt = Math.max(game.lastActionAt, game.lastPlayerActionAt)
    game.setTime(anyLastActionAt)
    
    const fallen = game.tetris.moveDown()
    if (fallen) return {
      changed: true,
      next: { fall: fallAnimation(game, { ...params, time }) },
    }
    
    const locked = game.elapsed(time) >= lockDelay ||
      // TODO
      playerActionsCnt >= lockDelayMaxPlayerActions
    if (locked) {
      game.tetris.lockCurrentPiece()
      game.advance(lockDelay)
      return {
        changed: false,
        next: { clearLines: clearLinesAnimation(game, { ...params, time }) },
      }
    }
    
    // TODO
    const playerMadeMove = !!dPlayerActionsCnt
    if (playerMadeMove) {
      // TODO
      game.setTime(time)
    }
    
    params = yield { changed: false }; ({ time } = params)
    playerActionsCnt += dPlayerActionsCnt
  } while (true)
}

function *moveLeftAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time, canPlayerMove } = params
  const { moveDas, moveArr } = game
  const multisteps = [
    { step: 0, cnt: 1 },
    { step: moveDas, cnt: 1 },
    { step: moveArr },
  ]
  const lastActionAt = StepTimer.of(time, multisteps)
  
  let changed = false
  
  const onChange = (time: number, cnt: count) => {
    game.lastPlayerActionAt = time
    game.playerActionsCnt += cnt
    changed = true
  }
  
  do {
    if (canPlayerMove) {
      const prevLastActionAt = lastActionAt.copy()
      const { time: t, dCnt } = lastActionAt.forwardTo(time)
      if (dCnt) {
        let realDCnt = 0
        for (; realDCnt < dCnt; realDCnt++) {
          // TODO make field method to move by count at once
          if (!game.tetris.moveLeft()) break
        }
        if (realDCnt) {
          const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
          onChange(t, dCnt)
        }
      }
    }
    params = yield { changed }; ({ time, canPlayerMove } = params)
    changed = false
  } while (true)
}

function *moveRightAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time, canPlayerMove } = params
  const { moveDas, moveArr } = game
  const multisteps = [
    { step: 0, cnt: 1 },
    { step: moveDas, cnt: 1 },
    { step: moveArr },
  ]
  const lastActionAt = StepTimer.of(time, multisteps)
  
  let changed = false
  
  const onChange = (time: number, cnt: count) => {
    game.lastPlayerActionAt = time
    game.playerActionsCnt += cnt
    changed = true
  }
  
  do {
    if (canPlayerMove) {
      const prevLastActionAt = lastActionAt.copy()
      const { time: t, dCnt } = lastActionAt.forwardTo(time)
      if (dCnt) {
        let realDCnt = 0
        for (; realDCnt < dCnt; realDCnt++) {
          // TODO make field method to move by count at once
          if (!game.tetris.moveRight()) break
        }
        if (realDCnt) {
          const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
          onChange(t, dCnt)
        }
      }
    }
    params = yield { changed }; ({ time, canPlayerMove } = params)
    changed = false
  } while (true)
}

function *rotateLeftAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time, canPlayerMove } = params
  const multisteps = [{ step: 0, cnt: 1 }]
  const lastActionAt = StepTimer.of(time, multisteps)
  
  let changed = false
  
  const onChange = (time: number, cnt: count) => {
    game.lastPlayerActionAt = time
    game.playerActionsCnt += cnt
    changed = true
  }
  
  do {
    if (canPlayerMove) {
      const prevLastActionAt = lastActionAt.copy()
      const { time: t, dCnt } = lastActionAt.forwardTo(time)
      if (dCnt) {
        let realDCnt = 0
        for (; realDCnt < dCnt; realDCnt++) {
          if (!game.tetris.rotateLeft()) break
        }
        if (realDCnt) {
          const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
          onChange(t, dCnt)
        }
      }
    }
    params = yield { changed }; ({ time, canPlayerMove } = params)
    changed = false
  } while (true)
}

function *rotateRightAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time, canPlayerMove } = params
  const multisteps = [{ step: 0, cnt: 1 }]
  const lastActionAt = StepTimer.of(time, multisteps)
  
  let changed = false
  
  const onChange = (time: number, cnt: count) => {
    game.lastPlayerActionAt = time
    game.playerActionsCnt += cnt
    changed = true
  }
  
  do {
    if (canPlayerMove) {
      const prevLastActionAt = lastActionAt.copy()
      const { time: t, dCnt } = lastActionAt.forwardTo(time)
      if (dCnt) {
        let realDCnt = 0
        for (; realDCnt < dCnt; realDCnt++) {
          if (!game.tetris.rotateRight()) break
        }
        if (realDCnt) {
          const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
          onChange(t, dCnt)
        }
      }
    }
    params = yield { changed }; ({ time, canPlayerMove } = params)
    changed = false
  } while (true)
}

function *hardDropAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time } = params
  const { hardDropInterval, scoresHardDropPerBlock } = game
  const multisteps = [{ step: 0, cnt: 1 }, { step: hardDropInterval }]
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
        game.addScore(realDCnt * scoresHardDropPerBlock)
        const { time: t, dCnt } = prevLastActionAt.forwardByCnt(realDCnt)
        onChange(t)
      }
    }
    
    const canFall = game.tetris.canMoveDown()
    if (!canFall) {
      game.tetris.lockCurrentPiece()
      return {
        changed,
        next: { clearLines: clearLinesAnimation(game, params) },
      }
    }
    
    params = yield { changed }; ({ time } = params)
    changed = false
  } while (true)
}

function *clearLinesAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time } = params
  const lines = game.tetris.getFullLines()
  if (!lines.length) return {
    changed: false,
    next: { spawnNextPiece: spawnNextPieceAnimation(game, params) },
  }
  
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
    params = yield { changed }; ({ time } = params)
    changed = false
  } while (true)
  
  do {
    const { removeLinesDelay } = game
    if (game.tickFor(removeLinesDelay, time)) {
      game.tetris.removeLines(lines)
      return {
        changed: !!lines.length,
        next: { spawnNextPiece: spawnNextPieceAnimation(game, params) },
      }
    }
    params = yield { changed }; ({ time } = params)
    changed = false
  } while (true)
}

function *spawnNextPieceAnimation(game: Game, params: GameAnimationParams): GameAnimation {
  let { time } = params
  do {
    const { entryDelay } = game
    if (game.tickFor(entryDelay, time)) break
    params = yield { changed: false }; ({ time } = params)
  } while (true)
  
  const spawned = game.tetris.spawnNextPiece()
  if (!spawned) {
    game.gameOver = true
    return { changed: false }
  }
  
  return {
    changed: true,
    next: { fall: fallAnimation(game, params) },
  }
}




export type PlayerActionType =
  | 'startMoveLeft' | 'stopMoveLeft'
  | 'startMoveRight' | 'stopMoveRight'
  | 'startMoveUp' | 'stopMoveUp'
  | 'startRotateLeft' | 'stopRotateLeft'
  | 'startRotateRight' | 'stopRotateRight'
  | 'startSoftDrop' | 'stopSoftDrop'
  | 'startHardDrop'

export type PlayerAction = { type: PlayerActionType, actionAt: ms }
export type PlayerActionsQueue = PlayerAction[]
const playerActionsComparator: Comparator<PlayerAction> = (a, b) => {
  return compareNumbers(a.actionAt, b.actionAt)
}



export type GameAnimationParams = {
  time: ms
  dPlayerActionsCnt: count
  canPlayerMove: boolean
}
export type GameAnimationNext = {
  changed: boolean // Is game state changed
}
export type GameAnimationResult = {
  changed: boolean // Is game state changed
  next?: PartDefined<GameAnimations> | undefined // Next animations to run
}
export type GameAnimation = IteratorObject<
  GameAnimationNext, // yield <value>
  GameAnimationResult, // return <value>
  GameAnimationParams // <value> = yield; iterator.next(<value>)
> | undefined



const animationNamesOrdered = [
  'spawnNextPiece',
  'clearLines',
  
  'hardDrop',
  
  'lockDelay',
  
  'softDrop',
  'moveUp',
  
  'fall',
  
  'moveLeft',
  'moveRight',
  'rotateLeft',
  'rotateRight',
] as const

export type GameAnimationNames = typeof animationNamesOrdered[number]

export type GameAnimations = RecordUndef<GameAnimationNames, GameAnimation>
