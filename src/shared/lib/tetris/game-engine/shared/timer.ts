


export class Timer {
  time: number
  
  constructor(time: number) { this.time = time }
  static at(time: number) { return new Timer(time) }
  
  timeTo(to: number): number { return to - this.time }
  advanceBy(duration: number): void { this.time += duration }
  tickBy(duration: number, limit: number): boolean {
    if (this.time + duration <= limit) { this.advanceBy(duration); return true }
    return false
  }
  tickTo(to: ms, limit: ms): boolean {
    if (to <= limit) { this.time = to; return true }
    return false
  }
}
