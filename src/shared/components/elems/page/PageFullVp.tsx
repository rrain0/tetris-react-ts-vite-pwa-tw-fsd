import type { Div } from '@@/utils/react/props/propTypes.ts'
import { isIOS } from 'react-device-detect'
import { useIsStandaloneOrFullscreen } from '@@/utils/css/useIsStandaloneOrFullscreen.ts'



export default function PageFullVp(props: Div) {
  
  const standalone = useIsStandaloneOrFullscreen()
  
  return (
    <div cn='w-min-[320] h-min-[480] sz-full' {...props}
      st={{
        ...isIOS && standalone && { width: '100vw', height: '100vh' },
      }}
    />
  )
}
