import type { EvHandler } from '@utils/ts/ts.ts'



export interface GamepadKeyHoldEv {
  type: 'gamepadKeyHold'
  ts: number
  gpId: string
  signalId: string
}

export type GamepadKeyHoldEvHandler = EvHandler<GamepadKeyHoldEv>