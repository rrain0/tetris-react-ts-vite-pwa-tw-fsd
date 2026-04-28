import { isundef } from '@@/utils/ts/ts.ts'



export class StepTimer {
  startAt: number
  multisteps: Multistep[]
  multistepI: count = 0
  stepI: count = 0
  duration: number = 0
  
  private constructor() { }
  static of(startAt: number, steps: Multistep[]) {
    const it = new StepTimer()
    it.startAt = startAt
    it.multisteps = steps
    return it
  }
  
  copy() {
    const it = new StepTimer()
    it.startAt = this.startAt
    it.multisteps = this.multisteps
    it.multistepI = this.multistepI
    it.stepI = this.stepI
    it.duration = this.duration
    return it
  }
  
  #calculateTo(to: number) {
    const { multisteps } = this
    let { multistepI, stepI } = this
    let dCnt = 0, dTime = 0, time = this.startAt + this.duration
    
    if (to < this.startAt + this.duration) {
      return { dCnt, dTime, time, multistepI, stepI }
    }
    
    while (multistepI < multisteps.length) {
      const { step, cnt } = multisteps[multistepI]
      
      const infiniteRepeat = isundef(cnt)
      const zeroInterval = !step
      
      const dCntUpTo = !zeroInterval
        ? Math.floor((to - time) / step)
        : Number.POSITIVE_INFINITY
      
      const dCntUpCnt = !infiniteRepeat ? cnt - stepI : dCntUpTo
      
      const goNextIntervals = !infiniteRepeat && dCntUpTo >= dCntUpCnt
      
      const dCntUp = Math.min(dCntUpTo, dCntUpCnt)
      const dTimeUp = step * dCntUp
      
      dCnt += dCntUp
      dTime += dTimeUp
      time += dTimeUp
      
      if (goNextIntervals) {
        multistepI++
        stepI = 0
      }
      else {
        stepI += dCntUp
        break
      }
    }
    return { dCnt, dTime, time, multistepI, stepI }
  }
  
  
  
  calculateTo(to: number) {
    const { dCnt, dTime, time } = this.#calculateTo(to)
    return { dCnt, dTime, time }
  }
  
  forwardTo(to: number) {
    const { dCnt, dTime, time, multistepI, stepI } = this.#calculateTo(to)
    this.multistepI = multistepI
    this.stepI = stepI
    this.duration += dTime
    return { dCnt, dTime, time }
  }
  
  forwardByCnt(count: count) {
    const { multisteps } = this
    let { multistepI, stepI } = this
    let dCnt = 0, dTime = 0, time = this.startAt + this.duration
    
    while (count > 0 && multistepI < multisteps.length) {
      const { step, cnt } = multisteps[multistepI]
      
      const infiniteRepeat = isundef(cnt)
      
      const dCntUp = infiniteRepeat ? count : Math.min(cnt - stepI, count)
      const dTimeUp = step * dCntUp
      
      const goNextIntervals = !infiniteRepeat && cnt - stepI - dCntUp <= 0
      
      dCnt += dCntUp
      dTime += dTimeUp
      time += dTimeUp
      count -= dCntUp
      
      if (goNextIntervals) {
        multistepI++
        stepI = 0
      }
      else {
        stepI += dCntUp
        break
      }
    }
    return { dCnt, dTime, time }
  }
}



export type Multistep = { step: number, cnt?: count | undefined }
