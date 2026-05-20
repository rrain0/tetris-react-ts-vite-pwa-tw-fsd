import { useMedia } from '@@/utils/css/useMedia.ts'



export function useIsStandaloneOrFullscreen() {
  
  // iOS treats standalone PWA as (display-mode: fullscreen).
  // Desktop Chrome treats Fullscreen API fullscreen as (display-mode: fullscreen).
  return useMedia('(display-mode: standalone), (display-mode: fullscreen)')
  
  //return useMedia('(display-mode: standalone)')
  
  // return useMedia(
  //   '(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)'
  // )
}
