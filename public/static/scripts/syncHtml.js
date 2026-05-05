


// TODO Html setup from Local Storage

function syncHtml() {
  // eslint-disable-next-line no-undef
  const buildMode = envBuildMode
  // eslint-disable-next-line no-undef
  const baseUrl = envBaseUrl
  
  updateTitle(buildMode)
  updateLinkManifest(buildMode, baseUrl)
}
//syncHtml()



function updateTitle(buildMode) {
  const title = 'Tetris'
  const isDev = buildMode === 'development'
  //document.title = (isDev ? 'Dev ' : '') + title
}

function updateLinkManifest(buildMode, baseUrl) {
  const linkManifest = document.querySelector('html > head > link[rel=manifest]')
  linkManifest.href = (() => {
    const manifestSearchParams = new URLSearchParams({
      buildMode,
    }).toString()
    
    let manifestUrl = baseUrl + 'manifest.json'
    if (manifestSearchParams) manifestUrl += '?' + manifestSearchParams
    
    return manifestUrl
  })()
}
