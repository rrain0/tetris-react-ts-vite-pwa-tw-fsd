import { useRefGetSet } from '@@/utils/react/state/useRefGetSet.ts'



export function usePointersData<T>(initialData?: PointersData<T>) {
  const [getPointers, setPointers] = useRefGetSet<PointersData<T>>(initialData ?? { })
  
  const getPointer = (pointerId: PointerId) => getPointers()[pointerId]
  const setPointer = (pointerId: PointerId, data?: T) => {
    if (!data) delete getPointers()[pointerId]
    else getPointers()[pointerId] = data
  }
  
  return [getPointer, setPointer, getPointers, setPointers] as const
}



type PointerId = number
export type PointersData<T> = Record<PointerId, T | undefined>
