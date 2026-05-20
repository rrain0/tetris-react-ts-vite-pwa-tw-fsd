

// <script src="/static/scripts/syncHtml.js"> in "/index.html"
// can't be bundled without type="module" attribute

// TODO Html setup from Local Storage

function globalSyncHtml() {
  // eslint-disable-next-line no-undef
  const deployMode = envBuildMode
  // eslint-disable-next-line no-undef
  const baseUrl = envBaseUrl
  
  updateTitle(deployMode)
  updateLinkManifest(deployMode, baseUrl)
}
//syncHtml()



function updateTitle(deployMode) {
  const title = 'Tetris'
  const isDev = deployMode === 'development'
  //document.title = (isDev ? 'Dev ' : '') + title
}

function updateLinkManifest(deployMode, baseUrl) {
  const linkManifest = document.querySelector('html > head > link[rel=manifest]')
  linkManifest.href = (() => {
    const manifestSearchParams = new URLSearchParams({
      deployMode,
    }).toString()
    
    let manifestUrl = baseUrl + 'manifest.json'
    if (manifestSearchParams) manifestUrl += '?' + manifestSearchParams
    
    return manifestUrl
  })()
}
