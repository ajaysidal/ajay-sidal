'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlchemyProvider } from './AlchemyProvider';

/**
 * Web3 Provider for MARZ Sanctuary
 * Wraps app with Alchemy Account Kit for Smart Wallet support
 *
 * Features:
 * - Alchemy Light Account (Smart Contract Wallet)
 * - Gas sponsorship via Alchemy Gas Manager
 * - Deterministic Smart Wallet addresses on Polygon
 *
 * Note: Privy authentication is handled separately in PrivyProvider
 * The Alchemy Account will be connected via Privy signers in components
 */
interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyProvider>
        {children}
      </AlchemyProvider>
    </QueryClientProvider>
  );
}
