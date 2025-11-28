import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Vision from './pages/Vision'
import Projects from './pages/Projects'
import Onboarding from './pages/Onboarding'
import Future from './pages/Future'

import './styles.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/future" element={<Future />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

