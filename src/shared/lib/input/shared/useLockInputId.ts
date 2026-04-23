import { InputManagerContext } from '@@/lib/app/input-manager/context/InputManagerContext.ts'
import type { InputType } from '@@/lib/app/input-manager/model/inputManager.model.ts'
import { use } from 'react'
import * as uuid from 'uuid'



export function useLockInputId() {
  const inputId = uuid.v4()
  const inputControls = use(InputManagerContext)
  
  const lock = (type: InputType) => inputControls.lock(type, inputId)
  const unlock = (type: InputType) => inputControls.unlock(type, inputId)
  const tryLock = (type: InputType) => inputControls.tryLock(type, inputId)
  const allowed = (type: InputType) => inputControls.allowed(type, inputId)
  
  return { lock, unlock, tryLock, allowed, inputId }
}
