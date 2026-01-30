import { type Cb, isdef, type Pu } from '@utils/ts/ts.ts'



// TODO options
// В тетрисе реактивное изменение delay/interval можно применить для
// увеличения / уменьшения скорости движения тетромино
// при управлении стиком или жестом зажатия + свайпа вбок, который контролирует скорость.
// В настройки добавить график (или функцию) зависимости скорости от положения стика/пальца
// для настройки интенсивности реакции на стик и жесты.

// TODO ReactiveInterval
// Массив последовательных задержек между интервалами

// TODO options
// + В настроках управления показать поле, где бесконечно зацикленно падает фигура,
// чтобы можно было прямо в настройках потыкать настроеннное управление.


// TODO ReactiveInterval
export class ReactiveInterval {
  delay: number
  interval: number
  cb: Cb | undefined
  
  startedAt: number | undefined
  timeoutId
  intervalId
  
  constructor({
    delay = 0,
    interval = 100,
    cb,
  }: ReactiveIntervalParams) {
    this.delay = delay
    this.interval = interval
    this.cb = cb
  }
  
  start() {
    this.stop()
    this.startedAt = Date.now()
    this.timeoutId = setTimeout(() => {
      this.intervalId = setInterval(() => {
        this.cb?.()
      }, this.interval)
      this.cb?.()
    }, this.delay)
    return this
  }
  
  update({ delay, interval, cb }: ReactiveIntervalParams) {
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



type ReactiveIntervalParams = Pu<{
  delay: number
  interval: number
  cb: Cb
}>
