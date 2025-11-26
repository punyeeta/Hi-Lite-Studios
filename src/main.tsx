import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MagazineProvider } from './context/MagazineContext'
import { FAQProvider } from './context/FAQContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MagazineProvider>
        <FAQProvider>
      <App />
      </FAQProvider>
    </MagazineProvider>
  </StrictMode>,
)
