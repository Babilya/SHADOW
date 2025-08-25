import { EconomyBalances, TransactionRecord, UserId } from './types.js';

const userBalances = new Map<UserId, EconomyBalances>();
const lastBonusAt = new Map<UserId, string>();
const txLog: TransactionRecord[] = [];

const START_BALANCE_ST = 1000;

export function getBalances(userId: UserId): EconomyBalances {
  if (!userBalances.has(userId)) {
    userBalances.set(userId, { st: START_BALANCE_ST, coins: 0 });
  }
  return userBalances.get(userId)!;
}

function pushTx(t: TransactionRecord) {
  txLog.push(t);
}

function uid(): string { return Math.random().toString(36).slice(2); }

export function credit(userId: UserId, amount: number, currency: 'ST'|'COINS', meta?: Record<string, unknown>) {
  const b = getBalances(userId);
  if (currency === 'ST') b.st += amount; else b.coins += amount;
  pushTx({ id: uid(), userId, type: 'credit', amount, currency, createdAt: new Date().toISOString(), meta });
}

export function debit(userId: UserId, amount: number, currency: 'ST'|'COINS', meta?: Record<string, unknown>) {
  const b = getBalances(userId);
  if (currency === 'ST') {
    if (b.st < amount) throw new Error('Insufficient ST');
    b.st -= amount;
  } else {
    if (b.coins < amount) throw new Error('Insufficient Coins');
    b.coins -= amount;
  }
  pushTx({ id: uid(), userId, type: 'debit', amount, currency, createdAt: new Date().toISOString(), meta });
}

export function exchangeToCoins(userId: UserId, st: number) {
  if (st <= 0) throw new Error('Invalid amount');
  debit(userId, st, 'ST', { reason: 'exchange' });
  credit(userId, st, 'COINS', { reason: 'exchange' });
}

export function exchangeToSt(userId: UserId, coins: number) {
  if (coins <= 0) throw new Error('Invalid amount');
  debit(userId, coins, 'COINS', { reason: 'exchange' });
  credit(userId, coins, 'ST', { reason: 'exchange' });
}

export function claimDailyBonus(userId: UserId): { awarded: number; nextAt: string } {
  const today = new Date().toISOString().slice(0,10);
  const last = lastBonusAt.get(userId);
  if (last === today) throw new Error('Bonus already claimed today');
  const bonus = 150;
  credit(userId, bonus, 'ST', { reason: 'daily' });
  lastBonusAt.set(userId, today);
  return { awarded: bonus, nextAt: today };
}

export function getTransactions(userId: UserId): TransactionRecord[] {
  return txLog.filter(t => t.userId === userId).slice(-50);
}