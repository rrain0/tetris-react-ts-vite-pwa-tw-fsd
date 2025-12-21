import * as React from 'react'
import AppCss from '@app/App/parts/AppCss.tsx'
import AppCssLayers from '@app/App/parts/AppCssLayers.tsx'
import AppRest from 'src/app/App/parts/AppRest.tsx'



export default function App() {
  return (
    <AppCssLayers>
      <AppCss>
        <AppRest/>
      </AppCss>
    </AppCssLayers>
  )
}
