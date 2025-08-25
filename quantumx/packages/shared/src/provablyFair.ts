import crypto from 'crypto';
import { ProvablyFairState } from './types.js';

export function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function hmacSha256Hex(key: string, message: string): string {
  return crypto.createHmac('sha256', key).update(message).digest('hex');
}

export function generateServerSeed(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function initialProvablyFairState(): ProvablyFairState {
  const serverSeed = generateServerSeed();
  return {
    serverSeed,
    serverSeedHash: sha256Hex(serverSeed),
    nonce: 0,
  };
}

export function rollRandomFloat(serverSeed: string, clientSeed: string, nonce: number): number {
  const msg = `${clientSeed}:${nonce}`;
  const h = hmacSha256Hex(serverSeed, msg);
  const slice = h.slice(0, 13);
  const intVal = parseInt(slice, 16);
  const max = Math.pow(16, slice.length) - 1;
  return intVal / max;
}