export type UserId = string;

export interface EconomyBalances {
  st: number;
  coins: number;
}

export interface TransactionRecord {
  id: string;
  userId: UserId;
  type: 'credit' | 'debit' | 'exchange' | 'bonus';
  amount: number;
  currency: 'ST' | 'COINS';
  createdAt: string;
  meta?: Record<string, unknown>;
}

// Project Management Types
export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  userId: UserId;
  title: string;
  description?: string;
  tasks: ProjectTask[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'archived';
}

export interface ProjectSummary {
  id: string;
  title: string;
  description?: string;
  taskCount: number;
  completedTasks: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ProvablyFairState {
  serverSeed: string;
  serverSeedHash: string;
  nonce: number;
}

export interface GameResultBase {
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  random: number;
}

export interface DiceResult extends GameResultBase {
  roll: number; // 0..99.99
}

export type CoinFlipSide = 'HEADS' | 'TAILS';
export interface CoinFlipResult extends GameResultBase {
  side: CoinFlipSide;
}

export interface CrashResult extends GameResultBase {
  multiplier: number; // e.g. 1.0 .. 1000.0
}

export interface SlotSpinResult extends GameResultBase {
  reels: string[];
  payoutMultiplier: number;
}

export interface RouletteSpinResult extends GameResultBase {
  number: number;
  color: 'RED' | 'BLACK' | 'GREEN';
}

export interface MinesFieldResult extends GameResultBase {
  size: number;
  mines: number[];
}