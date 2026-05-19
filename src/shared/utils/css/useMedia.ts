import { useLayoutEffect, useState } from 'react'



export function useMedia(media: string) {
  
  const [mediaQuery, setMediaQuery] = useState(() => window.matchMedia(media))
  
  useLayoutEffect(() => {
    setMediaQuery(window.matchMedia(media))
  }, [media])
  
  const [matches, setMatches] = useState(mediaQuery.matches)
  
  useLayoutEffect(() => {
    const onChange = () => setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => { mediaQuery.removeEventListener('change', onChange) }
  }, [mediaQuery])
  
  return matches
}
