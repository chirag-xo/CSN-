import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/globals.css'
import './styles/original.css'
import './styles/carousel.css'
import './styles/howitworks.css'
import './styles/purpose.css'
import './styles/mission.css'
import './styles/cta.css'
import './styles/mobile-responsive.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
