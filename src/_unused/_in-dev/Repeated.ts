import { type Cb, isdef, type Opt } from '@@/utils/ts/ts.ts'



// TODO options
// В тетрисе реактивное изменение delay/interval можно применить для
// увеличения / уменьшения скорости движения тетромино
// при управлении стиком или жестом зажатия + свайпа вбок, который контролирует скорость.
// В настройки добавить график (или функцию) зависимости скорости от положения стика/пальца
// для настройки интенсивности реакции на стик и жесты.

// TODO Repeat
// Массив последовательных задержек между интервалами

// TODO options
// + В настроках управления показать поле, где бесконечно зацикленно падает фигура,
// чтобы можно было прямо в настройках потыкать настроеннное управление.


// TODO Repeat
export class Repeated {
  delay: number
  interval: number
  cb: Cb | undefined
  
  startedAt: number | undefined
  timeoutId: any
  intervalId: any
  
  constructor({
    delay = 0,
    interval = 100,
    // delays: [200, 200, 200, 100, 100, 100]
    cb,
  }: ReactiveIntervalParams) {
    this.delay = delay
    this.interval = interval
    this.cb = cb
  }
  
  start() {
    this.stop()
    this.startedAt = Date.now()
    
    const applyInterval = () => {
      this.intervalId = setInterval(() => {
        this.cb?.()
      }, this.interval)
    }
    const applyTimeout = () => {
      if (this.delay > 0) {
        this.timeoutId = setTimeout(() => {
          applyInterval()
          this.cb?.()
        }, this.delay)
      }
      else {
        applyInterval()
        this.cb?.()
      }
    }
    
    applyTimeout()
    return this
  }
  
  update({ delay, interval, cb }: ReactiveIntervalParams) {
    throw new Error('NOT IMPLEMENTED')
    if (isdef(cb)) this.cb = cb
    return this
  }
  
  stop() {
    clearTimeout(this.timeoutId)
    clearInterval(this.intervalId)
    this.startedAt = undefined
    this.timeoutId = undefined
    this.intervalId = undefined
    return this
  }
}



type ReactiveIntervalParams = Opt<{
  delay: number
  interval: number
  cb: Cb
}>
