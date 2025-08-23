import React from 'react'
import { motion } from 'framer-motion'

const Card: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <motion.div className="glass" style={{ padding: 16 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
    {children}
  </motion.div>
)

const Dashboard: React.FC = () => (
  <div className="grid">
    <Card title="Wallet">
      <div>ST Balance: <b>0</b></div>
    </Card>
    <Card title="OSINT Search">
      <div>Phone, Email, Social — try it in the app.</div>
    </Card>
    <Card title="Shop">
      <div>VIP, AI packs, Mystery Box</div>
    </Card>
    <Card title="VIP">
      <div>Priority OSINT, bonuses, and more.</div>
    </Card>
  </div>
)

export default Dashboard
