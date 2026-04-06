import type { Div } from '@utils/react/props/propTypes.ts'



export default function PageFullVp(props: Div) {
  return (
    <div cn={`wMin-[${wMin}] hMin-[${hMin}] w-[100dvw] h-[100dvh]`} {...props}/>
  )
}



const wMin = 320
const hMin = 480
