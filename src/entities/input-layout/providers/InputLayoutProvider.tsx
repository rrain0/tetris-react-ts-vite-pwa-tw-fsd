import type { Children } from '@@/utils/react/props/propTypes.ts'
import { InputLayoutContext } from '@/entities/input-layout/context/InputLayoutContext.ts'
import { inputLayoutConfigDefault } from '@/entities/input-layout/lib/inputLayoutConfigDefault.ts'



export default function InputLayoutProvider({ children }: Children) {
  
  return (
    <InputLayoutContext value={{ inputLayout: inputLayoutConfigDefault }}>
      {children}
    </InputLayoutContext>
  )
}
