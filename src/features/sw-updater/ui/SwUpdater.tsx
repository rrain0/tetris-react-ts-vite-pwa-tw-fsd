import './reload-prompt.css'
import { envBuildVer } from '@/app/env.ts'
import Modal from '@@/components/components/modal/Modal.tsx'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { pwaInfo } from 'virtual:pwa-info'



// Vite PWA React:
// https://vite-pwa-org.netlify.app/examples/react
// Vite PWA React example:
// https://github.com/vite-pwa/vite-plugin-pwa/blob/main/examples/react-router/src/ReloadPrompt.tsx

// New sw script can be applied only from client!!!






export default function SwUpdater() {
  const buildVer = envBuildVer
  const autoCheckUpdates = true
  
  console.log('pwaInfo', pwaInfo)
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    // Вызывается при каждом монтировании компоненты, даже когда SW уже был зареган ранее
    onRegisteredSW(swUrl, swRegistration) {
      console.log(`SW at: ${swUrl}`)
      
      if (autoCheckUpdates && swRegistration) {
        // Check updates immediately when component was mounted
        void swRegistration.update()
        
        // Then check updates by interval
        const checkUpdateInterval = 60 * 60 * 1000 // 1h
        setInterval(() => {
          console.log('Checking for SW update...')
          // Manually request service worker update
          // SW will be updated if a fetched SW script is different
          void swRegistration.update()
        }, checkUpdateInterval)
      }
      else {
        console.log('SW registered: ' + swRegistration)
      }
      
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }
  
  /* 
  const uiTextOrig = {
    appReadyToWorkOffline: 'App ready to work offline',
    updateDownloaded: 'New content available, click on reload button to update',
    reload: 'Reload',
    later: 'Later',
    ok: 'OK',
  }
   */
  const uiTextRu = {
    appReadyToWorkOffline:
      'PWA: Ресурсы приложения загружены и оно готово работать оффлайн',
    updateDownloaded:
      'PWA: Обновление загружено. Чтобы оно вступило в силу, нужно обновить страницу',
    reloadNow: 'Обновить сейчас',
    close: 'Закрыть',
    ok: 'ОК',
  }
  const uiTextEn = {
    appReadyToWorkOffline:
      'PWA: App resources are loaded and it ready to work offline',
    updateDownloaded:
      'PWA: Update downloaded. You need to reload the page for it to take effect',
    reloadNow: 'Reload now',
    close: 'Close',
    ok: 'OK',
  }
  
  return (
    <>
      <div className='reload-prompt-buildDate'>{buildVer}</div>
      {(offlineReady || needRefresh) && (
        <Modal onlyFrame>
          <div className='reload-prompt-container'>
            <div className='reload-prompt-toast'>
              
              <div className='reload-prompt-message'>
                {offlineReady
                  ? <span>{uiTextRu.appReadyToWorkOffline}</span>
                  : <span>{uiTextRu.updateDownloaded}</span>
                }
              </div>
              
              {/* <strong>Reload</strong> will refresh the app. You may lose the
               progress, if any. */}
              {needRefresh && (
                <>
                  <button className='reload-prompt-toast-button'
                    // Reloads the current window to allow the service worker take the control.
                    onClick={() => updateServiceWorker(true)}
                  >
                    {uiTextRu.reloadNow}
                  </button>
                  {/* <strong>Cancel</strong> will install the update next time you visit
                   the app. */}
                  <button className='reload-prompt-toast-button'
                    onClick={() => close()}
                  >
                    {uiTextRu.close}
                  </button>
                </>
              )}
              
              {!needRefresh && (
                <button className='reload-prompt-toast-button'
                  onClick={() => close()}
                >
                  {uiTextRu.ok}
                </button>
              )}
            
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
