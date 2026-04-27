import { Timer } from '@@/lib/tetris/game-engine/shared/timer.ts'
import { Tetris } from '@@/lib/tetris/tetris-engine/entities/tetris/model/tetris.ts'
import { getDocTime } from '@@/utils/dom/getDocTime.ts'
import { type Comparator, compareNumbers } from '@@/utils/js/compare.ts'
import { setOf } from '@@/utils/js/factory.ts'
import { type Cb, isdef } from '@@/utils/ts/ts.ts'



export class Game {
  
  // Config - gameplay
  startLevel: count = 1
  linesToLvlUp: count = 10
  
  
  
  
  // Config - animations
  entryDelay: ms = 400
  
  fallIntervalForLvl1: ms = 1000
  
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
  pausedAt: ms | undefined = 0 // document time ms
  rafPaused = true
  
  // TODO
  animating: GameAnimation | undefined
  lastActionAt: ms = 0 // document time ms
  allowMove = false
  
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
      
      if (!this.animating) this.nextAnimation(this.fallAnimation(t))
      while (this.animating) {
        const result = this.animating.next({ time: t, dPlayerActionsCnt })
        changed ||= result.value.changed
        if (!result.done) break
        this.nextAnimation(result.value.next)
      }
      
      
      if (type === 'startMoveLeft') {
        if (!this.movingLeft) this.movingLeft = this.moveLeftAnimation(actionAt, actionAt)
      }
      else if (type === 'startMoveRight') {
        if (!this.movingRight) this.movingRight = this.moveRightAnimation(actionAt, actionAt)
      }
      
      while (this.movingLeft) {
        const result = this.movingLeft.next({ time: t, dPlayerActionsCnt })
        changed ||= result.value.changed
        if (!result.done) break
      }
      while (this.movingRight) {
        const result = this.movingRight.next({ time: t, dPlayerActionsCnt })
        changed ||= result.value.changed
        if (!result.done) break
      }
      
      if (type === 'stopMoveLeft') {
        this.movingLeft = undefined
      }
      else if (type === 'stopMoveRight') {
        this.movingRight = undefined
      }
      
      
      if (!action || actionAt >= time) break
    }
    actions.splice(0, i)
    
    if (changed) this.notifyChange()
    
    requestAnimationFrame(this.run)
  }
  
  
  
  // Engine animations
  ;*fallAnimation(time: ms): GameAnimation {
    this.allowMove = true
    do {
      const { fallInterval } = this
      
      const fallDepth = Math.floor(this.elapsed(time) / fallInterval)
      const fallen = this.tetris.fallBy(fallDepth)
      this.advance(fallen * fallInterval)
      const changed = !!fallen
      
      const canFall = this.tetris.canMoveDown()
      if (!canFall) return { changed, next: this.lockDelayAnimation(time) }
      
      ;({ time } = yield { changed })
    } while (true)
  }
  
  // TODO Check it works correctly
  ;*lockDelayAnimation(time: ms): GameAnimation {
    this.allowMove = true
    let playerActionsCnt = 0
    let dPlayerActionsCnt = 0
    do {
      const { lockDelay, lockDelayMaxPlayerActions } = this
      
      const anyLastActionAt = Math.max(this.lastActionAt, this.lastPlayerActionAt)
      this.setTime(anyLastActionAt)
      
      const fallen = this.tetris.moveDown()
      if (fallen) return { changed: true, next: this.fallAnimation(time) }
      
      const locked = this.elapsed(time) >= lockDelay ||
        // TODO
        playerActionsCnt >= lockDelayMaxPlayerActions
      if (locked) {
        this.tetris.lockCurrentPiece()
        this.advance(lockDelay)
        return { changed: false, next: this.clearLinesAnimation(time) }
      }
      
      // TODO
      const playerMadeMove = !!dPlayerActionsCnt
      if (playerMadeMove) {
        // TODO
        this.setTime(time)
      }
      
      ;({ time, dPlayerActionsCnt } = yield { changed: false })
      playerActionsCnt += dPlayerActionsCnt
    } while (true)
  }
  
  ;*moveLeftAnimation(time: ms, moveAt: ms): GameAnimation {
    const lastActionAt = Timer.at(moveAt)
    let changed = false
    
    const onChange = () => {
      this.lastPlayerActionAt = lastActionAt.time
      this.playerActionsCnt++
    }
    
    do {
      const { allowMove } = this
      if (time >= moveAt) {
        if (allowMove) changed = this.tetris.moveLeft()
        if (changed) onChange()
        break
      }
      ;({ time } = yield { changed }); changed = false
    } while (true)
    
    do {
      const { allowMove, moveLeftRightDas } = this
      if (lastActionAt.tickBy(moveLeftRightDas, time)) {
        if (allowMove) changed = this.tetris.moveLeft()
        if (changed) onChange()
        break
      }
      ;({ time } = yield { changed }); changed = false
    } while (true)
    
    do {
      const { allowMove, moveLeftRightArr } = this
      if (lastActionAt.tickBy(moveLeftRightArr, time)) {
        if (allowMove) changed = this.tetris.moveLeft()
        if (changed) onChange()
      }
      ;({ time } = yield { changed }); changed = false
    } while (true)
  }
  
  ;*moveRightAnimation(time: ms, moveAt: ms): GameAnimation {
    const lastActionAt = Timer.at(moveAt)
    let changed = false
    
    const onChange = () => {
      this.lastPlayerActionAt = lastActionAt.time
      this.playerActionsCnt++
    }
    
    do {
      const { allowMove } = this
      if (time >= moveAt) {
        if (allowMove) changed = this.tetris.moveRight()
        if (changed) onChange()
        break
      }
      ;({ time } = yield { changed }); changed = false
    } while (true)
    
    do {
      const { allowMove, moveLeftRightDas } = this
      if (lastActionAt.tickBy(moveLeftRightDas, time)) {
        if (allowMove) changed = this.tetris.moveRight()
        if (changed) onChange()
        break
      }
      ;({ time } = yield { changed }); changed = false
    } while (true)
    
    do {
      const { allowMove, moveLeftRightArr } = this
      if (lastActionAt.tickBy(moveLeftRightArr, time)) {
        if (allowMove) changed = this.tetris.moveRight()
        if (changed) onChange()
      }
      ;({ time } = yield { changed }); changed = false
    } while (true)
  }
  
  ;*dropAnimation(time: ms): GameAnimation {
    do {
      const { dropInterval, scoresHardDropPerBlock } = this
      
      const fallDepth = Math.floor(this.elapsed(time) / dropInterval)
      this.advance(fallDepth * dropInterval)
      
      const fallen = this.tetris.fallBy(fallDepth)
      this.addScore(fallen * scoresHardDropPerBlock)
      const changed = !!fallen
      
      if (!this.tetris.canMoveDown()) {
        this.tetris.lockCurrentPiece()
        return { changed, next: this.clearLinesAnimation(time) }
      }
      ;({ time } = yield { changed })
    } while (true)
  }
  
  ;*clearLinesAnimation(time: ms): GameAnimation {
    const lines = this.tetris.getFullLines()
    if (!lines.length) return { changed: false, next: this.spawnNextPieceAnimation(time) }
    
    let changed = false
    do {
      const { clearLinesDelay, linesToLvlUp } = this
      
      if (this.tickFor(clearLinesDelay, time)) {
        this.tetris.clearLines(lines)
        const prevLines = this.lines
        
        this.lines += lines.length
        
        this.level += Math.floor(this.lines / linesToLvlUp) - Math.floor(prevLines / linesToLvlUp)
        
        this.addScore(this.getScoresClearLines(lines.length))
        if (this.tetris.field.bottomEmpty) this.addScore(this.scoresAllClear)
        
        changed = !!lines.length
        break
      }
      ;({ time } = yield { changed }); changed = false
    } while (true)
    
    do {
      const { removeLinesDelay } = this
      if (this.tickFor(removeLinesDelay, time)) {
        this.tetris.removeLines(lines)
        return { changed: !!lines.length, next: this.spawnNextPieceAnimation(time) }
      }
      ;({ time } = yield { changed }); changed = false
    } while (true)
  }
  
  ;*spawnNextPieceAnimation(time: ms): GameAnimation {
    do {
      const { entryDelay } = this
      if (this.tickFor(entryDelay, time)) break
      ;({ time } = yield { changed: false })
    } while (true)
    
    const spawned = this.tetris.spawnNextPiece()
    if (!spawned) {
      this.gameOver = true
      return { changed: false }
    }
    
    return { changed: true, next: this.fallAnimation(time) }
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
  
  
  
  // TODO how to process them?
  // Player actions
  // TODO
  processPlayerAction(moved: boolean) {
    if (moved) {
      this.lastPlayerActionAt = getDocTime()
      this.playerActionsCnt++
    }
  }
  moveDown() {
    if (!this.allowPlayerAction) return
    const moved = this.tetris.moveDown()
    this.processPlayerAction(moved)
  }
  moveUp() {
    if (!this.allowPlayerAction) return
    const moved = this.tetris.moveUp()
    if (moved) this.animating = this.fallAnimation(getDocTime())
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
    this.nextAnimation(this.dropAnimation(time))
  }
  
}



export type PlayerActionType =
  | 'startMoveLeft'
  | 'stopMoveLeft'
  | 'startMoveRight'
  | 'stopMoveRight'
  
  | 'moveDown' // 'softDrop'
  | 'moveUp'
  | 'rotateLeft'
  | 'rotateRight'
  | 'hardDrop'

export type PlayerAction = { type: PlayerActionType, actionAt: ms }
export type PlayerActionsQueue = PlayerAction[]
// TODO add sort that if time is equals so start becomes before stop
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
