import { inputLayoutConfigDefault } from '@/entities/input-layout/lib/inputLayoutConfigDefault.ts'
import type { InputLayoutConfig } from '@/entities/input-layout/model/inputLayout.ts'
import { createContext } from 'react'



export interface InputLayoutContextValue {
  inputLayout: InputLayoutConfig
}

export const InputLayoutContext = createContext<InputLayoutContextValue>({
  inputLayout: inputLayoutConfigDefault,
})
