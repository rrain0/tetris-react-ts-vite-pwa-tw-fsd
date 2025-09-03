import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'src/styles/app/reset.css'
import 'src/styles/app/fonts.css'
import 'src/styles/app/app.css'
import App from 'src/components/app/App.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>
)
