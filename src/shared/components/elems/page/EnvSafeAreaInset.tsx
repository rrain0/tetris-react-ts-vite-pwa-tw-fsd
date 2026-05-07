import type { Div } from '@@/utils/react/props/propTypes.ts'



export default function EnvSafeAreaInset(props: Div) {
  return (
    <div cn='envSafeAreaPaddings' {...props}/>
  )
}
