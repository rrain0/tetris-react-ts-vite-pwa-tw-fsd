import { InputManagerContext } from '@@/lib/app/input-manager/context/InputManagerContext.ts'
import type { InputId, InputType } from '@@/lib/app/input-manager/model/inputManager.model.ts'
import type { Children } from '@@/utils/react/props/propTypes.ts'
import { mapOf, setOf } from '@@/utils/react/state/state.ts'
import { useRefGetSetInit } from '@@/utils/react/state/useRefGetSetInit.ts'



export default function InputManagerProvider({ children }: Children) {
  
  type InputLocks = Map<InputType, Set<InputId>>
  const [getInputLocks] = useRefGetSetInit<InputLocks>(mapOf)
  
  
  const lock = (inputId: InputId, type: InputType) => {
    getInputLocks().getOrInsert(type, setOf()).add(inputId)
  }
  const unlock = (inputId: InputId, type: InputType) => {
    //console.log('input unlock', type, inputId)
    const locks = getInputLocks()
    const ids = locks.get(type)
    if (ids) {
      ids.delete(inputId)
      if (!ids.size) locks.delete(type)
    }
  }
  const tryLock = (inputId: InputId, type: InputType) => {
    //console.log('input tryLock', type, inputId)
    const locks = getInputLocks()
    if (locks.has(type)) return false
    locks.set(type, setOf(inputId))
    return true
  }
  const allow = (inputId: InputId, type: InputType) => {
    //console.log('input allow', type, inputId)
    const ids = getInputLocks().get(type)
    if (!ids?.size) return true
    if (ids.has(inputId)) return true
    return false
  }
  
  
  return (
    <InputManagerContext value={{ lock, unlock, tryLock, allow }}>
      {children}
    </InputManagerContext>
  )
}
