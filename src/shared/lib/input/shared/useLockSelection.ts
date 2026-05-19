import { useInsertionEffect, useLayoutEffect } from 'react'
import * as uuid from 'uuid'



export default function useLockSelection() {
  const id = uuid.v4()
  const noSelectClass = `no-select-${id}`
  
  // ℹ️ Does not add duplicate class
  const lock = () => document.documentElement.classList.add(noSelectClass)
  const unlock = () => document.documentElement.classList.remove(noSelectClass)
  
  useInsertionEffect(() => {
    const style = document.createElement('style')
    style.textContent = `.${noSelectClass} { user-select: none; }`
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])
  
  useLayoutEffect(() => () => unlock(), [])
  
  return [lock, unlock] as const
}
