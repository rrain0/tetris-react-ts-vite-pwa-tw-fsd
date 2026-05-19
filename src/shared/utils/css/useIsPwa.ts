import { useMedia } from '@@/utils/css/useMedia.ts'



export function useIsPwa() {
  return useMedia(
    '(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)'
  )
}
