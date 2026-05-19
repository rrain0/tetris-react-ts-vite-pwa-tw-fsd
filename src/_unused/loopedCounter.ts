


export class LoopedCounter {
  #max: count = maxCnt
  #value: count = 0
  
  get max(): count { return this.#max }
  set max(max: count) { this.#max = Math.min(max, maxCnt) }
  
  get value(): count { return this.#value }
  set value(newValue: count) { this.#value = newValue % (this.#max + 1) }
  
  constructor(start = 0, max = maxCnt) {
    this.max = max
    this.value = start
  }
  
  inc() { this.value++; return this }
  add(cnt: count) { this.value = this.value + cnt % (this.max + 1); return this }
  
  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default') {
    if (hint === 'string') return this.value + ''
    return this.value
  }
}

const maxCnt = Math.floor(Number.MAX_SAFE_INTEGER / 2)
