import { useLayoutEffect } from 'react'
import { isAndroid } from 'react-device-detect'



export default function SyncToHtml() {
  
  useLayoutEffect(() => {
    const linkManifest = document
      .querySelector('html > head > link[rel=manifest]') as HTMLLinkElement | null
    if (linkManifest) {
      let [path, query = ''] = linkManifest.getAttribute('href')!.split(/[?](.*)/s)
      const params = new URLSearchParams(query)
      
      if (isAndroid) params.set('pwaMode', 'fullscreen')
      else params.delete('pwaMode')
      
      query = params.toString()
      if (query) query = '?' + query
      linkManifest.href = path + query
    }
  }, [])
  
  return undefined
}
