import { isundef } from '@@/utils/ts/ts.ts'



export class IntervalTimer {
  startAt: number
  intervals: IntervalData[]
  intervalsI: count = 0
  intervalI: count = 0
  duration: number = 0
  
  private constructor() { }
  static of(startAt: number, delays: IntervalData[]) {
    const it = new IntervalTimer()
    it.startAt = startAt
    it.intervals = delays
    return it
  }
  
  #timeTo(to: number) {
    const { intervals } = this
    let { intervalsI, intervalI } = this
    let dCnt = 0, dTime = 0, time = this.startAt + this.duration
    
    if (to < this.startAt + this.duration) return { dCnt, dTime, time, intervalsI, intervalI }
    
    while (true) {
      const { interval, cnt } = intervals[intervalsI]
      
      const infiniteIntervals = isundef(cnt)
      const infiniteInterval = !interval
      
      const cntUpTo = !infiniteInterval
        ? Math.floor((to - time) / interval)
        : Number.POSITIVE_INFINITY
      
      const cntUpCnt = !infiniteIntervals ? cnt - intervalI : cntUpTo
      
      const canGoNextIntervals = !infiniteIntervals && cntUpTo >= cntUpCnt
      
      const cntUp = Math.min(cntUpTo, cntUpCnt)
      const dTimeUp = interval * cntUp
      
      dCnt += cntUp
      dTime += dTimeUp
      time += dTimeUp
      
      if (canGoNextIntervals) {
        intervalsI++
        intervalI = 0
      }
      else {
        intervalI += cntUp
        break
      }
    }
    return { dCnt, dTime, time, intervalsI, intervalI }
  }
  
  
  
  timeTo(to: number) {
    const { dCnt, dTime, time } = this.#timeTo(to)
    return { dCnt, dTime, time }
  }
  
  forwardTo(to: number) {
    const { dCnt, dTime, time, intervalsI, intervalI } = this.#timeTo(to)
    this.intervalsI = intervalsI
    this.intervalI = intervalI
    this.duration += dTime
    return { dCnt, dTime, time }
  }
}



export type IntervalData = { interval: number, cnt?: count | undefined }
