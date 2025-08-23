import React from 'react'
import { createRoot } from 'react-dom/client'
import { motion } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import { api } from './lib/api'

const App = () => {
  const [lang, setLang] = React.useState<'ua' | 'ru' | 'en'>('ua')
  const [tgId, setTgId] = React.useState<number | null>(null)

  React.useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp
    try {
      tg?.ready?.()
      tg?.expand?.()
      const lid = tg?.initDataUnsafe?.user?.language_code || 'uk'
      setLang(lid.startsWith('ru') ? 'ru' : lid.startsWith('en') ? 'en' : 'ua')
      const uid = tg?.initDataUnsafe?.user?.id || null
      setTgId(uid)
      if (uid) api.analytics({ user_id: uid, event_name: 'app_open' }).catch(() => {})
    } catch {}
  }, [])
  return (
    <div style={{ padding: 20 }}>
      <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        QuantumX
      </motion.h1>
      <Dashboard lang={lang} />
      <div className="footer">Developed by SHADOW and COMPANY (R&D partner)</div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
