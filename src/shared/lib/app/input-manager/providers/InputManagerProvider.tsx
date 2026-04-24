import { InputManagerContext } from '@@/lib/app/input-manager/context/InputManagerContext.ts'
import type { InputIdData } from '@@/lib/app/input-manager/model/inputManager.model.ts'
import { arrRemoveBy } from '@@/utils/array/arrRemoveBy.ts'
import type { Children } from '@@/utils/react/props/propTypes.ts'
import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'



export default function InputManagerProvider({ children }: Children) {
  
  type InputLocks = InputIdData[]
  const [getInputLocks] = useRefGetSet<InputLocks>([])
  
  
  const lock = (lock: InputIdData) => {
    //console.log('input lock', lock)
    const { inputId, type, ...data } = lock
    const locks = getInputLocks()
    
    if (type === 'pointer') {
      const { pointerId } = data
      // If no such element then add it
      if (!locks.find(it => it.inputId === inputId &&
        it.type === type &&
        it.pointerId === pointerId
      )) {
        return
      }
      locks.push(lock)
    }
  }
  
  const unlock = (lock: InputIdData) => {
    //console.log('input unlock', lock)
    const { inputId, type, ...data } = lock
    const locks = getInputLocks()
    
    if (type === 'pointer') {
      const { pointerId } = data
      // Remove such element
      arrRemoveBy(locks, it => it.inputId === inputId &&
        it.type === type &&
        it.pointerId === pointerId
      )
    }
  }
  
  const tryLock = (lock: InputIdData) => {
    //console.log('input tryLock', lock)
    const { inputId, type, ...data } = lock
    const locks = getInputLocks()
    
    if (type === 'pointer') {
      const { pointerId } = data
      // If no such lock then add it
      if (locks.find(it => it.inputId === inputId &&
        it.type === type &&
        it.pointerId === pointerId
      )) {
        return false
      }
      locks.push(lock)
      return true
    }
    return false
  }
  
  const allowed = (lock: InputIdData) => {
    //console.log('input allowed', lock)
    const { inputId, type, ...data } = lock
    const locks = getInputLocks()
    
    if (type === 'pointer') {
      const { pointerId } = data
      // If no such lock then allowed
      if (!locks.find(it => it.type === type && it.pointerId === pointerId)) {
        return true
      }
      // If it has such element then allowed
      if (locks.find(it => it.inputId === inputId &&
        it.type === type &&
        it.pointerId === pointerId
      )) {
        return true
      }
      return false
    }
    return false
  }
  
  
  return (
    <InputManagerContext value={{ lock, unlock, tryLock, allowed }}>
      {children}
    </InputManagerContext>
  )
}
