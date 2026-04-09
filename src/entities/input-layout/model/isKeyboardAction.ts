import type { ActionConfig, InputLayoutConfig } from '@entities/input-layout/model/inputLayout.ts'



export function isKeyboardAction<T extends keyof InputLayoutConfig>(
  type: T,
  action: keyof InputLayoutConfig[T],
  { code }: { code: string }, // KeyboardEvent.code
  inputLayout: InputLayoutConfig,
) {
  //const a = use()
  // @ts-expect-error
  const actionConfig: ActionConfig = inputLayout[type][action]
  return actionConfig.some(it => it.inputMethod === 'keyboard' && it.key === code)
}
