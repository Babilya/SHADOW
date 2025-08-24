import { rollRandomFloat } from './provablyFair.js';
import { CoinFlipResult, CrashResult, DiceResult, SlotSpinResult, RouletteSpinResult, MinesFieldResult } from './types.js';

export function playDice(serverSeedHash: string, serverSeed: string, clientSeed: string, nonce: number): DiceResult {
  const r = rollRandomFloat(serverSeed, clientSeed, nonce);
  const roll = Math.floor(r * 10000) / 100; // 0..99.99
  return { serverSeedHash, clientSeed, nonce, random: r, roll };
}

export function playCoinFlip(serverSeedHash: string, serverSeed: string, clientSeed: string, nonce: number): CoinFlipResult {
  const r = rollRandomFloat(serverSeed, clientSeed, nonce);
  const side = r < 0.5 ? 'HEADS' : 'TAILS';
  return { serverSeedHash, clientSeed, nonce, random: r, side };
}

export function playCrash(serverSeedHash: string, serverSeed: string, clientSeed: string, nonce: number): CrashResult {
  const r = rollRandomFloat(serverSeed, clientSeed, nonce);
  const base = 1 / (1 - Math.min(r, 0.999999));
  const multiplier = Math.max(1.0, Math.min(base, 1000));
  return { serverSeedHash, clientSeed, nonce, random: r, multiplier: Number(multiplier.toFixed(2)) };
}

const REEL = ['CHERRY','LEMON','ORANGE','DIAMOND','BAR','SEVEN'];
const PAYOUT: Record<string, number> = {
  'CHERRY': 2,
  'LEMON': 3,
  'ORANGE': 5,
  'DIAMOND': 10,
  'BAR': 25,
  'SEVEN': 50,
};

export function playSlots(serverSeedHash: string, serverSeed: string, clientSeed: string, nonce: number): SlotSpinResult {
  const r1 = rollRandomFloat(serverSeed, clientSeed, nonce);
  const r2 = rollRandomFloat(serverSeed, clientSeed, nonce + 1);
  const r3 = rollRandomFloat(serverSeed, clientSeed, nonce + 2);
  const i1 = Math.floor(r1 * REEL.length);
  const i2 = Math.floor(r2 * REEL.length);
  const i3 = Math.floor(r3 * REEL.length);
  const reels = [REEL[i1], REEL[i2], REEL[i3]];
  let payoutMultiplier = 0;
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    payoutMultiplier = PAYOUT[reels[0]];
  }
  return { serverSeedHash, clientSeed, nonce, random: r1, reels, payoutMultiplier };
}

export function playRoulette(serverSeedHash: string, serverSeed: string, clientSeed: string, nonce: number): RouletteSpinResult {
  const r = rollRandomFloat(serverSeed, clientSeed, nonce);
  const number = Math.floor(r * 37);
  const redSet = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  const color = number === 0 ? 'GREEN' : (redSet.has(number) ? 'RED' : 'BLACK');
  return { serverSeedHash, clientSeed, nonce, random: r, number, color } as RouletteSpinResult;
}

export function generateMines(serverSeedHash: string, serverSeed: string, clientSeed: string, nonce: number, size = 25, mines = 3): MinesFieldResult {
  const bombIdx: number[] = [];
  let i = 0;
  while (bombIdx.length < mines) {
    const r = rollRandomFloat(serverSeed, clientSeed, nonce + i++);
    const idx = Math.floor(r * size);
    if (!bombIdx.includes(idx)) bombIdx.push(idx);
  }
  return { serverSeedHash, clientSeed, nonce, random: 0, size, mines: bombIdx } as MinesFieldResult;
}