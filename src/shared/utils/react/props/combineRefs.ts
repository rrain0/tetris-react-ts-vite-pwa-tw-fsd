import { isfunction, isobject } from '@@/utils/ts/ts.ts'
import type { Ref, RefCallback } from 'react'



export function combineRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (elem: T | null) => {
    for (const ref of refs) {
      if (isfunction(ref)) ref(elem)
      else if (isobject(ref)) ref.current = elem
    }
  }
}
