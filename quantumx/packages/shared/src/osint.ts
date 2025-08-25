export interface OsintResultBase {
  query: string;
  type: 'email' | 'phone' | 'tg-id' | 'domain' | 'ip';
  confidenceScore: number; // 0..100
  summary: string;
  sources: Array<{ name: string; url?: string; lastSeen?: string }>;
  metadata: Record<string, unknown>;
}

function nowIso() { return new Date().toISOString(); }

export async function searchEmail(email: string): Promise<OsintResultBase> {
  return {
    query: email,
    type: 'email',
    confidenceScore: 72,
    summary: 'Базова перевірка email. Виявлено MX, SPF, можливі згадки у витоках.',
    sources: [
      { name: 'DNS MX', lastSeen: nowIso() },
      { name: 'Public Breach Mentions' },
      { name: 'Social Lookup' },
    ],
    metadata: { deliverability: 'unknown', mx: true, spf: true },
  };
}

export async function searchPhone(phone: string): Promise<OsintResultBase> {
  return {
    query: phone,
    type: 'phone',
    confidenceScore: 65,
    summary: 'Базова перевірка номера: країна/регіон, тип, ймовірні месенджери.',
    sources: [
      { name: 'Numbering Plan' },
      { name: 'Carrier Heuristics' },
      { name: 'Public Messengers' },
    ],
    metadata: { country: 'UA', type: 'mobile', carriers: ['unknown'] },
  };
}

export async function searchTelegramId(tgId: string): Promise<OsintResultBase> {
  return {
    query: tgId,
    type: 'tg-id',
    confidenceScore: 58,
    summary: 'Публічні сигнали профілю Telegram (без приватних даних).',
    sources: [
      { name: 'Public Username' },
      { name: 'Public Groups' },
    ],
    metadata: { username: undefined, premium: false },
  };
}

export async function analyzeDomain(domain: string): Promise<OsintResultBase> {
  return {
    query: domain,
    type: 'domain',
    confidenceScore: 80,
    summary: 'WHOIS/DNS сигнали, безпекові записи, базова репутація.',
    sources: [
      { name: 'WHOIS' },
      { name: 'DNS A/MX/TXT' },
      { name: 'Reputation Lists' },
    ],
    metadata: { hasSPF: true, hasDMARC: false, ssl: 'unknown' },
  };
}

export async function analyzeIp(ip: string): Promise<OsintResultBase> {
  return {
    query: ip,
    type: 'ip',
    confidenceScore: 77,
    summary: 'Гео/ASN, базова перевірка на VPN/Proxy/Tor (публічні індикатори).',
    sources: [
      { name: 'GeoIP' },
      { name: 'ASN' },
      { name: 'Open Blocklists' },
    ],
    metadata: { country: 'unknown', asn: 'AS??', isTor: false },
  };
}