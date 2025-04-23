import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CovidDashboard from './components/CovidDashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CovidDashboard />
  </StrictMode>,
)
