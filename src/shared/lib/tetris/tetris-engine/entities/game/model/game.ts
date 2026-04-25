import { Tetris } from '@@/lib/tetris/tetris-engine/entities/tetris/model/tetris.ts'
import { getDocTime } from '@@/utils/dom/getDocTime.ts'
import { setOf } from '@@/utils/js/factory.ts'
import { type Cb, isdef } from '@@/utils/ts/ts.ts'



export class Game {
  
  // Config
  startLevel = 1
  linesToLvlUp = 10
  fallIntervalForLvl1 = 1000
  dropIntervalForLvl1 = 10
  lockDelayLvl1 = 500
  lockDelayMovesLeft = 50
  
  get fallInterval() { return this.fallIntervalForLvl1 }
  get dropInterval() { return this.dropIntervalForLvl1 }
  get lockDelay() { return this.lockDelayLvl1 }
  
  scoresForDroppedBlock = 2
  
  
  
  // Progress
  hiScore = 0
  lines = 0
  score = 0
  level = this.startLevel
  tetris: Tetris = new Tetris()
  
  addScore(score: number) {
    this.score += score
    this.hiScore = Math.max(this.hiScore, this.score)
  }
  
  
  
  // Listeners
  listeners: Set<Cb> = setOf()
  onChange(listener: Cb) { this.listeners.add(listener) }
  offChange(listener: Cb) { this.listeners.delete(listener) }
  notifyChange() { for (const l of this.listeners) l() }
  
  
  
  // Running state & actions
  state: 'fall' | 'lockDelay' | 'gameOver' = 'fall'
  animation: IterableIterator<void, void, number> | undefined
  lastActionAt = 0 // document time ms
  pausedAt: number | undefined = 0 // document time ms
  rafPaused = true
  currLockDelayLeftMoves = this.lockDelayMovesLeft
  
  isPause(): this is { get pausedAt(): number; set pausedAt(pausedAt: number | undefined) } {
    return isdef(this.pausedAt)
  }
  get isPlaying() { return !this.isPause() && this.state !== 'gameOver' }
  get canMove() {
    const { state, animation } = this
    return (state === 'fall' || state === 'lockDelay') && !this.isPause() && !animation
  }
  
  resume() {
    if (this.isPause()) {
      const pausedFor = getDocTime() - this.pausedAt
      this.lastActionAt += pausedFor
      this.pausedAt = undefined
      if (this.rafPaused) {
        this.rafPaused = false
        requestAnimationFrame(this.run)
      }
    }
  }
  pause() { this.pausedAt = getDocTime() }
  
  
  
  // Lifecycle methods
  run = (docTime: number) => {
    if (!this.isPlaying) { this.rafPaused = true; return }
    
    //while (this.lastActionAt < docTime || this.state !== 'gameOver') { }
    
    if (this.animation) {
      if (this.animation.next(docTime).done) this.animation = undefined
      this.notifyChange()
    }
    
    if (!this.animation) {
      if (this.state === 'fall') {
        this.fall(docTime)
      }
      else if (this.state === 'lockDelay') {
        const locked = docTime - this.lastActionAt >= this.lockDelay
        if (locked) {
          this.lastActionAt = docTime
          this.goNextPiece()
        }
      }
    }
    
    requestAnimationFrame(this.run)
  }
  syncState(moved = false) {
    const { state, tetris } = this
    if (this.animation) { }
    else if (state === 'fall') {
      if (!tetris.canMoveDown()) { this.goLockDelay(); return }
    }
    else if (state === 'lockDelay') {
      if (moved) this.lastActionAt = getDocTime()
      const fallen = tetris.moveDown()
      if (fallen) { this.goFall(); return }
      else {
        if (moved) this.currLockDelayLeftMoves--
        if (this.currLockDelayLeftMoves <= 0) { this.goNextPiece(); return }
      }
    }
    this.notifyChange()
  }
  
  goLockDelay() {
    this.state = 'lockDelay'
    this.notifyChange()
  }
  goFall() {
    this.state = 'fall'
    this.currLockDelayLeftMoves = this.lockDelayMovesLeft
    this.syncState()
  }
  goNextPiece() {
    this.tetris.lockCurrentPiece()
    const lines = this.tetris.getFullLines()
    this.tetris.clearLines(lines)
    this.tetris.dropLines(lines)
    const spawned = this.tetris.spawnNewPiece()
    if (!spawned) { this.state = 'gameOver'; return }
    this.goFall()
  }
  
  
  
  // Animations
  fall(docTime: number) {
    const { lastActionAt, fallInterval } = this
    const fallDepth = Math.floor((docTime - lastActionAt) / fallInterval)
    this.lastActionAt = lastActionAt + fallDepth * fallInterval
    if (fallDepth) {
      const fallenBy = this.tetris.fallBy(fallDepth)
      this.syncState(!!fallenBy)
    }
  }
  ;*dropAnim(): IterableIterator<void, void, number> {
    while (true) {
      const docTime = yield
      const { lastActionAt, dropInterval, scoresForDroppedBlock } = this
      const fallDepth = Math.floor((docTime - lastActionAt) / dropInterval)
      this.lastActionAt = lastActionAt + fallDepth * dropInterval
      const fallen = this.tetris.fallBy(fallDepth)
      this.addScore(fallen * scoresForDroppedBlock)
      if (!this.tetris.canMoveDown()) { this.goNextPiece(); return }
    }
  }
  
  
  
  // User actions
  moveLeft() {
    if (!this.canMove) return
    const moved = this.tetris.moveLeft()
    if (moved) this.syncState(true)
  }
  moveRight() {
    if (!this.canMove) return
    const moved = this.tetris.moveRight()
    if (moved) this.syncState(true)
  }
  moveDown() {
    if (!this.canMove) return
    const moved = this.tetris.moveDown()
    if (moved) this.syncState(true)
  }
  moveUp() {
    if (!this.canMove) return
    const moved = this.tetris.moveUp()
    if (moved) this.syncState(true)
  }
  rotateLeft() {
    if (!this.canMove) return
    const moved = this.tetris.rotateLeft()
    if (moved) this.syncState(true)
  }
  rotateRight() {
    if (!this.canMove) return
    const moved = this.tetris.rotateRight()
    if (moved) this.syncState(true)
  }
  hardDrop() {
    if (!this.canMove) return
    this.lastActionAt = getDocTime()
    this.animation = this.dropAnim()
  }
  
}
