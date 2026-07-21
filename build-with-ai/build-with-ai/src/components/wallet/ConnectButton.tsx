// @ts-nocheck

// TEMP STUB: Privy → Alchemy+Openfort migration (June 14 launch)
// DO NOT USE IN PRODUCTION - Replace with real Alchemy Account Kit + Openfort integration
export const usePrivy = () => ({
  authenticated: false,
  user: null,
  login: async () => { console.warn('Auth stub: Implement Alchemy Account Kit'); return Promise.resolve(); },
  logout: async () => { console.warn('Auth stub'); return Promise.resolve(); },
  ready: true,
  linkWallet: async () => { console.warn('Auth stub'); },
});
export const useLogin = () => ({ login: async () => {} });
export const PrivyProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

'use client';

import { useState, useEffect } from 'react';
import { ClientWeb3Boundary } from '@/components/providers/ClientWeb3Boundary';

function ConnectButtonInner() {
  const { login, logout, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return <div className="w-24 h-10 bg-gray-800 rounded-lg animate-pulse" />;
  }

  const connected = authenticated && wallets.length > 0;
  const wallet = wallets[0];

  if (connected && wallet) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400">Connected</span>
          <span className="text-sm font-medium text-[#00f2ff]">
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => logout()}
          className="px-3 py-1.5 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="px-4 py-1.5 text-sm bg-gradient-to-r from-[#00f2ff] to-cyan-600 text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
    >
      Connect Wallet
    </button>
  );
}

function ConnectButtonSmallInner() {
  const { login, logout, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return <div className="w-20 h-8 bg-gray-800 rounded-lg animate-pulse" />;
  }

  const connected = authenticated && wallets.length > 0;
  const wallet = wallets[0];

  if (connected && wallet) {
    return (
      <button
        onClick={() => logout()}
        className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
      >
        {wallet.address.slice(0, 4)}...
      </button>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="px-3 py-1.5 text-xs bg-[#00f2ff]/10 text-[#00f2ff] hover:bg-[#00f2ff]/20 rounded-lg transition-colors"
    >
      Connect
    </button>
  );
}

export function ConnectButton() {
  return (
    <ClientWeb3Boundary fallback={<div className="w-24 h-10 bg-gray-800 rounded-lg animate-pulse" />}>
      <ConnectButtonInner />
    </ClientWeb3Boundary>
  );
}

export function ConnectButtonSmall() {
  return (
    <ClientWeb3Boundary fallback={<div className="w-20 h-8 bg-gray-800 rounded-lg animate-pulse" />}>
      <ConnectButtonSmallInner />
    </ClientWeb3Boundary>
  );
}

export default ConnectButton;
