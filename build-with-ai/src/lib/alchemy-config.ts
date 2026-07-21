/**
 * Alchemy Account Kit Configuration for MARZ Sanctuary
 * Integrates Smart Wallets with Privy authentication
 *
 * This enables:
 * - Email/Social login (no seed phrases)
 * - Gas sponsorship
 * - Account recovery
 * - Session management
 */

import { polygon } from 'viem/chains';
import { http } from 'viem';

// Alchemy configuration from environment
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';
const policyId = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID || '';

// Create the Alchemy config for Account Kit
export const alchemyConfig = {
  apiKey,
  chain: polygon,
  transport: http(process.env.ALCHEMY_POLYGON_RPC || `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`),
  policyId,
};

// Session management for NextAuth integration
export interface SmartWalletSession {
  address: string;
  isLoggedIn: boolean;
  loginMethod: 'email' | 'google' | 'discord' | 'twitter' | 'apple' | 'metaMask';
  expiresAt?: number;
}

// Store session in localStorage for client-side persistence
export const saveSmartWalletSession = (session: SmartWalletSession) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('smart_wallet_session', JSON.stringify(session));
  }
};

export const getSmartWalletSession = (): SmartWalletSession | null => {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('smart_wallet_session');
    if (session) {
      const parsed = JSON.parse(session);
      // Check if session is expired
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem('smart_wallet_session');
        return null;
      }
      return parsed;
    }
  }
  return null;
};

export const clearSmartWalletSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('smart_wallet_session');
  }
};

export default alchemyConfig;
