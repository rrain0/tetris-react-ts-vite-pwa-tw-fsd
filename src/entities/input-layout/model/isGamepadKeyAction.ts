import type { ActionConfig, InputLayoutConfig } from '@/entities/input-layout/model/inputLayout.ts'



export function isGamepadKeyAction<T extends keyof InputLayoutConfig>(
  inputLayout: InputLayoutConfig,
  type: T,
  action: keyof InputLayoutConfig[T],
  signalId: string,
) {
  // @ts-expect-error
  const actionConfig: ActionConfig = inputLayout[type][action]
  return actionConfig.some(it => it.inputMethod === 'gamepad' && it.key === signalId)
}
