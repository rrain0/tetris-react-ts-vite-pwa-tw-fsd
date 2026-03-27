import type { EvHandler } from '@utils/ts/ts.ts'



export interface GamepadKeyDownClickEv {
  type: 'gamepadKeyDownClick'
  ts: number
  gpId: string
  signalId: string
}

export type GamepadKeyDownClickEvHandler = EvHandler<GamepadKeyDownClickEv>