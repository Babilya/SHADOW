export type Lang = 'ua' | 'ru' | 'en'

export const t = (lang: Lang) => ({
  title: 'QuantumX',
  wallet: 'Гаманець',
  balance: 'Баланс',
  claimBonus: 'Отримати бонус',
  osint: 'OSINT пошук',
  shop: 'Магазин',
  vip: 'VIP',
  openApp: 'Відкрити додаток',
  ...(lang === 'en' && {
    title: 'QuantumX',
    wallet: 'Wallet',
    balance: 'Balance',
    claimBonus: 'Claim bonus',
    osint: 'OSINT search',
    shop: 'Shop',
    vip: 'VIP',
    openApp: 'Open app',
  }),
  ...(lang === 'ru' && {
    title: 'QuantumX',
    wallet: 'Кошелек',
    balance: 'Баланс',
    claimBonus: 'Забрать бонус',
    osint: 'OSINT поиск',
    shop: 'Магазин',
    vip: 'VIP',
    openApp: 'Открыть приложение',
  }),
})