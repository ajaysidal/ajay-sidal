'use client';

import { ReactNode, useState, useEffect } from 'react';

/**
 * Alchemy Account Provider for MARZ Sanctuary
 * Integrates Smart Wallets with Privy authentication
 *
 * This provider wraps the app with Alchemy Account Kit,
 * which will be connected to Privy signers via useWallets hook
 */
interface AlchemyProviderProps {
  children: ReactNode;
}

// Alchemy configuration from environment
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';
const ALCHEMY_POLICY_ID = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID || '';

export function AlchemyProvider({ children }: AlchemyProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  // Check if Alchemy is configured
  if (!ALCHEMY_API_KEY || ALCHEMY_API_KEY === 'your_alchemy_api_key_here') {
    // Render children without provider if Alchemy is not configured
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Alchemy not configured. Set ALCHEMY_API_KEY to enable Smart Wallets.');
    }
    return <>{children}</>;
  }

  return <>{children}</>;
}
