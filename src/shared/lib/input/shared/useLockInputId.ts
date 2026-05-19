import { InputManagerContext } from '@@/lib/app/input-manager/context/InputManagerContext.ts'
import type { InputData } from '@@/lib/app/input-manager/model/inputManager.model.ts'
import { use } from 'react'
import * as uuid from 'uuid'



export function useLockInputId() {
  const inputId = uuid.v4()
  const inputControls = use(InputManagerContext)
  
  const lock = (input: InputData) => inputControls.lock({ inputId, ...input })
  const unlock = (input: InputData) => inputControls.unlock({ inputId, ...input })
  const tryLock = (input: InputData) => inputControls.tryLock({ inputId, ...input })
  const allowed = (input: InputData) => inputControls.allowed({ inputId, ...input })
  
  return { lock, unlock, tryLock, allowed, inputId }
}
