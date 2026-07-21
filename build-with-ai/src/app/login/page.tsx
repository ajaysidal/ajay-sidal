'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSmartAccount } from '@/hooks/useSmartAccount';

export default function LoginPage() {
  const { login, authenticated, ready, address } = useSmartAccount();
  const [status, setStatus] = useState('Ready to sign in');

  useEffect(() => {
    if (authenticated && address) {
      setStatus(`Signed in as ${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [authenticated, address]);

  const handleLogin = async () => {
    setStatus('Connecting wallet session...');
    await login();
    setStatus(authenticated ? 'Signed in successfully' : 'Sign-in completed');
  };

  return (
    <main className="min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Authentication</p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
        <p className="mt-3 text-sm text-zinc-400">Use the built-in wallet session flow to continue working in the Build With AI platform.</p>
        <button
          onClick={handleLogin}
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          {ready ? 'Continue with wallet' : 'Loading...'}
        </button>
        <p className="mt-4 text-center text-sm text-zinc-500">Don&apos;t have an account? <Link href="/signup" className="text-cyan-400 hover:underline">Create one</Link></p>
        <p className="mt-6 text-sm text-zinc-500">{status}</p>
      </div>
    </main>
  );
}
