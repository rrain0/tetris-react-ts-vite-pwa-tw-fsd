import { isundef } from '@@/utils/ts/ts.ts'



export class IntervalTimer {
  startAt: number
  intervals: IntervalData[]
  intervalsI: count = 0
  intervalI: count = 0
  dTime: number = 0
  
  private constructor() { }
  static of(startAt: number, delays: IntervalData[]) {
    const it = new IntervalTimer()
    it.startAt = startAt
    it.intervals = delays
    return it
  }
  
  advanceTo(to: number) {
    if (to < this.startAt + this.dTime) return {
      advanceCnt: 0, advanceTime: 0,
      time: this.startAt + this.dTime,
    }
    
    let advanceCnt = 0, advanceTime = 0
    while (true) {
      const { startAt, intervals, intervalsI, intervalI, dTime } = this
      const { interval, cnt } = intervals[intervalsI]
      
      const time = startAt + dTime
      const infiniteIntervals = isundef(cnt)
      const infiniteInterval = !!interval
      
      const cntUpTo = !infiniteInterval
        ? Math.floor((to - time) / interval)
        : Number.POSITIVE_INFINITY
      
      const cntUpCnt = !infiniteIntervals ? cnt - intervalI : cntUpTo
      
      const canGoNextIntervals = !infiniteIntervals && cntUpTo >= cntUpCnt
      
      const cntUp = Math.min(cntUpTo, cntUpCnt)
      const dTimeUp = interval * cntUp
      
      advanceCnt += cntUp
      advanceTime += dTimeUp
      
      this.dTime += dTimeUp
      
      if (canGoNextIntervals) {
        this.intervalsI++
        this.intervalI = 0
      }
      else {
        this.intervalI += cntUp
        break
      }
    }
    return {
      advanceCnt, advanceTime,
      time: this.startAt + this.dTime,
    }
  }
}



export type IntervalData = { interval: number, cnt?: count | undefined }
