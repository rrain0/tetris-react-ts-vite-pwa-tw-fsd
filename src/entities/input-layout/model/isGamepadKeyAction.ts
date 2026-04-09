import type { ActionConfig, InputLayoutConfig } from '@entities/input-layout/model/inputLayout.ts'



export function isGamepadKeyAction<T extends keyof InputLayoutConfig>(
  type: T,
  action: keyof InputLayoutConfig[T],
  { signalId }: { signalId: string },
  inputLayout: InputLayoutConfig,
) {
  // @ts-expect-error
  const actionConfig: ActionConfig = inputLayout[type][action]
  return actionConfig.some(it => it.inputMethod === 'gamepad' && it.key === signalId)
}
