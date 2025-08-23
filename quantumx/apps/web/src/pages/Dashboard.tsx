import React from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { t, type Lang } from '../i18n'

const Card: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <motion.div className="glass" style={{ padding: 16 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
    {children}
  </motion.div>
)

const useTelegramId = (): number | null => {
  const [id, setId] = React.useState<number | null>(null)
  React.useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp
    const tid = tg?.initDataUnsafe?.user?.id || null
    setId(tid)
  }, [])
  return id
}

const Dashboard: React.FC<{ lang?: Lang }> = ({ lang = 'ua' }) => {
  const tgId = useTelegramId()
  const [balance, setBalance] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(false)
  const tr = t(lang)

  React.useEffect(() => {
    if (!tgId) return
    api.getWallet(tgId).then((w) => setBalance(w.st_balance)).catch(() => {})
  }, [tgId])

  const claim = async () => {
    if (!tgId) return
    setLoading(true)
    try {
      const res = await api.claimBonus(tgId)
      setBalance(res.st_balance)
      await api.analytics({ user_id: tgId, event_name: 'bonus_claim', properties: { claimed: res.claimed } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid">
      <Card title={tr.wallet}>
        <div>{tr.balance}: <b>{balance}</b> ST</div>
        <div style={{ marginTop: 8 }}>
          <button className="btn" onClick={claim} disabled={loading}>{tr.claimBonus}</button>
        </div>
      </Card>
      <Card title={tr.osint}>
        <div>Phone, Email, Social — try it in the app.</div>
      </Card>
      <Card title={tr.shop}>
        <div>VIP, AI packs, Mystery Box</div>
      </Card>
      <Card title={tr.vip}>
        <div>Priority OSINT, bonuses, and more.</div>
      </Card>
    </div>
  )
}

export default Dashboard
