export const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  getWallet: (telegramId: number) => request<{ telegram_id: number; st_balance: number }>(`/wallet/${telegramId}`),
  claimBonus: (telegramId: number) => request<{ claimed: boolean; bonus?: number; st_balance: number }>(`/bonus/claim/${telegramId}`, { method: 'POST' }),
  getProfile: (telegramId: number) => request<{ telegram_id: number; username: string | null; language: string }>(`/profile/${telegramId}`),
  updateProfile: (telegramId: number, data: { username?: string | null; language?: string }) => request(`/profile/${telegramId}`, { method: 'POST', body: JSON.stringify(data) }),
  analytics: (payload: { user_id?: number; event_name: string; properties?: Record<string, unknown> }) => request(`/analytics/`, { method: 'POST', body: JSON.stringify(payload) }),
}