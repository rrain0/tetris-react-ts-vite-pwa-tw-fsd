import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'
import {
  isfunction,
  type Setter,
  type SetterOrUpdater,
  type Updater,
  type ValueOrProducer,
} from '@@/utils/ts/ts.ts'
import { useState } from 'react'



export function useStateAndRef<S>(initialState: ValueOrProducer<S>) {
  
  const [state, setState] = useState(initialState)
  // useState handles initial value for ref to be set
  const [get, setRef, ref] = useRefGetSet(state)
  
  const set: Setter<S> = value => {
    setRef(value)
    setState(value)
  }
  
  const update: Updater<S> = updater => {
    set(updater(get()))
  }
  
  const setOrUpdate: SetterOrUpdater<S> = valueOrUpdater => {
    if (isfunction(valueOrUpdater)) update(valueOrUpdater)
    else set(valueOrUpdater)
  }
  
  return { get, set, update, setOrUpdate, state, ref }
}
