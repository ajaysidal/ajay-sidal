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

import { ClientWeb3Boundary } from '@/components/providers/ClientWeb3Boundary';

function ConnectWalletButtonInner() {
  const { login, logout, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  const connected = authenticated && wallets.length > 0;
  const wallet = wallets[0];

  if (!ready) {
    return (
      <button
        disabled
        className="
          bg-neutral-900
          border border-neutral-800
          text-white
          px-8
          py-3
          rounded-lg
          font-bold
          text-sm
          backdrop-blur-sm
          bg-opacity-90
          opacity-50
          cursor-not-allowed
        "
      >
        Loading...
      </button>
    );
  }

  if (!connected) {
    return (
      <button
        onClick={() => login()}
        type="button"
        className="
          bg-neutral-900
          border border-neutral-800
          hover:border-[#00f2ff]/50
          text-white
          px-8
          py-3
          rounded-lg
          font-bold
          text-sm
          transition-all
          shadow-[0_0_15px_rgba(0,242,255,0.3)]
          hover:shadow-[0_0_25px_rgba(0,242,255,0.5)]
          hover:scale-105
          flex items-center gap-2
          backdrop-blur-sm
          bg-opacity-90
        "
      >
        <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => logout()}
        type="button"
        className="
          bg-gradient-to-r from-[#00f2ff]/20 to-[#00f2ff]/10
          border border-[#00f2ff]/50
          text-[#00f2ff]
          px-6
          py-2
          rounded-lg
          font-black
          text-sm
          transition-all
          shadow-[0_0_20px_rgba(0,242,255,0.4)]
          hover:shadow-[0_0_30px_rgba(0,242,255,0.6)]
          hover:scale-105
          backdrop-blur-md
          flex items-center gap-2
        "
      >
        <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
        {wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}
      </button>
    </div>
  );
}

export function ConnectWalletButton() {
  return (
    <ClientWeb3Boundary
      fallback={
        <button disabled className="bg-neutral-900 border border-neutral-800 text-white px-8 py-3 rounded-lg font-bold text-sm opacity-50 cursor-not-allowed">
          Loading...
        </button>
      }
    >
      <ConnectWalletButtonInner />
    </ClientWeb3Boundary>
  );
}

export default ConnectWalletButton;
