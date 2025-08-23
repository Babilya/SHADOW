import React from 'react'
import { createRoot } from 'react-dom/client'
import { motion } from 'framer-motion'
import Dashboard from './pages/Dashboard'

const App = () => {
  React.useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp
    try {
      tg?.ready?.()
      tg?.expand?.()
    } catch {}
  }, [])
  return (
    <div style={{ padding: 20 }}>
      <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        QuantumX
      </motion.h1>
      <Dashboard />
      <div className="footer">Developed by SHADOW and COMPANY (R&D partner)</div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
