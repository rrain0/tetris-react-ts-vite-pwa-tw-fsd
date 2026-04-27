import type { ActionConfig, InputLayoutConfig } from '@/entities/input-layout/model/inputLayout.ts'



export function isKeyboardKeyAction<T extends keyof InputLayoutConfig>(
  inputLayout: InputLayoutConfig,
  type: T,
  action: keyof InputLayoutConfig[T],
  key: string, // <KeyboardEvent>.code
) {
  // @ts-expect-error
  const actionConfig: ActionConfig = inputLayout[type][action]
  return actionConfig.some(it => it.inputMethod === 'keyboard' && it.key === key)
}
