import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import NeuroRisk from './pages/NeuroRisk.jsx'
import PaginaCV from './pages/PaginaCV.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/neuro-risk" element={<NeuroRisk />} />
        <Route path="/cv" element={<PaginaCV />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)