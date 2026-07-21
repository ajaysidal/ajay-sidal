// src/hooks/useSmartAccount.ts
/**
 * Safe‑powered sovereign smart account hook.
 * Replaces all Openfort logic with your new local signer + Safe account.
 */

import { useEffect, useState } from 'react';
import {
  getLocalSigner,
  createSafeAccount,
} from '@/lib/sovereignWallet';

type LoginMethod = 'email' | 'google' | 'wallet';

export type SmartAccountState = {
  authenticated: boolean;
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
  } | null;
  address: string | null;
  login: (method?: LoginMethod) => Promise<void>;
  logout: () => Promise<void>;
  ready: boolean;
  loginMethod: 'openfort-email' | 'openfort-google' | 'openfort-wallet' | null;
};

export function useSmartAccount(): SmartAccountState {
  const [authenticated, setAuthenticated] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Load session on mount
  useEffect(() => {
    try {
      const session = localStorage.getItem('sovereign_session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.address) {
          setAuthenticated(true);
          setAddress(parsed.address);
        }
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  // Login = initialize Safe account + persist session
  const login = async () => {
    try {
      const { address } = await createSafeAccount();

      localStorage.setItem(
        'sovereign_session',
        JSON.stringify({ address })
      );

      setAuthenticated(true);
      setAddress(address);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  // Logout = clear session + reset state
  const logout = async () => {
    localStorage.removeItem('sovereign_session');
    setAuthenticated(false);
    setAddress(null);
  };

  return {
    authenticated,
    user: authenticated
      ? {
          id: address,
          email: null,
          name: 'Sovereign User',
        }
      : null,
    address,
    login,
    logout,
    ready,
    loginMethod: authenticated ? 'openfort-wallet' : null,
  };
}
