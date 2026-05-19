import { isfunction, isobject, isundef, type UnionToIntersection } from '@@/utils/ts/ts.ts'



export const propsOf = combineProps

export function combineProps<A extends any[]>(
  ...propsList: A
): UnionToIntersection<NoInfer<A>[number] & object> {
  const callbacks: Record<any, any[]> = { }
  let combinedProps: Record<any, any> | undefined = undefined
  
  for (let i = 0; i < propsList.length; i++) {
    const props = propsList[i]
    if (isobject(props)) {
      // save first props
      if (!combinedProps) combinedProps = { ...props }
      else for (const [p, v] of Object.entries(props)) {
        // save first value
        //@ts-expect-error
        if (isundef(combinedProps[p])) combinedProps[p] = v
        else {
          //@ts-expect-error
          const v0 = combinedProps[p]
          
          // combine object or fun refs to single fun ref
          if (p === 'ref') {
            if (!callbacks[p]) {
              callbacks[p] = [v0]
              combinedProps[p] = (ref: any) => {
                for (const cb of callbacks[p]) {
                  if (isfunction(cb)) cb(ref)
                  // @ts-ignore
                  else if (isobject(cb)) cb.current = ref
                }
              }
            }
            callbacks[p].push(v)
          }
          // combine styles to single object
          else if (p === 'style') {
            // @ts-ignore
            combinedProps[p] = { ...combinedProps[p], ...v }
          }
          // combine css classes to single string
          else if (p === 'cn') {
            combinedProps[p] = v0 + ' ' + v
          }
          // combine callbacks to single callback
          else if (isfunction(v)) {
            //@ts-expect-error
            if (!callbacks[p]) {
              //@ts-expect-error
              callbacks[p] = [v0]
              //@ts-expect-error
              combinedProps[p] = (...args: any[]) => {
                //@ts-expect-error
                for (const cb of callbacks[p]) cb(...args)
              }
            }
            //@ts-expect-error
            callbacks[p].push(v)
          }
          // replace old value by new value
          else {
            //@ts-expect-error
            combinedProps[p] = v
          }
          
        }
      }
    }
  }
  
  //@ts-ignore
  return combinedProps ?? { }
}
