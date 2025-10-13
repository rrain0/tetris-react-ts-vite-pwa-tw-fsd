import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'src/styles/app/layers.css'
import App from 'src/components/app/App.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>
)
