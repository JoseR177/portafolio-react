import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import NeuroFisk from './pages/NeuroFisk.jsx'
import PaginaCV from './pages/PaginaCV.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/neurofisk" element={<NeuroFisk />} />
        <Route path="/cv" element={<PaginaCV />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)