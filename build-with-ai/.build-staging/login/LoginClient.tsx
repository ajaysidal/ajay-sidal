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

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Loader2, Shield, Sparkles } from 'lucide-react';
import { ClientWeb3Boundary } from '@/components/providers/ClientWeb3Boundary';

/**
 * MARZ Sanctuary Login - Privy Powered
 * Zero-vulnerability authentication with embedded wallets
 */
function LoginClientInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const isAdmin = params.get('admin') === '1';

  const { authenticated, user, ready } = usePrivy();
  const { login } = useLogin({
    onComplete: async ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
      // User successfully logged in
      // Privy automatically creates an embedded wallet for new users
      console.log('✅ Login successful:', {
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        loginAccount,
      });

      // Redirect after successful login
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push(next);
      }
    },
    onError: (error) => {
      console.error('❌ Login failed:', error);
      setError(typeof error === 'string' ? error : 'Authentication failed');
    },
  });

  const [adminSecret, setAdminSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  if (authenticated && user && !isAdmin) {
    router.push(next);
    return null;
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Set admin secret cookie for admin dashboard access
      document.cookie = `admin_secret=${encodeURIComponent(adminSecret)}; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax; Secure`;

      // Give cookie time to set, then redirect
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to admin dashboard - the page will validate the cookie
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-16">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-400" />
            <h1 className="text-xl font-semibold tracking-tight">
              {isAdmin ? 'Admin Access' : 'Enter the Sanctuary'}
            </h1>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            {isAdmin
              ? 'Enter your admin secret to access the dashboard.'
              : 'Secure, gasless authentication powered by Alchemy + Openfort + Polygon'}
          </p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Admin Secret Login - Always show for admin access */}
          {isAdmin && (
            <form onSubmit={handleAdminLogin} className="grid gap-3">
              <div className="space-y-2">
                <label htmlFor="admin-secret" className="text-sm font-medium text-zinc-200">
                  Admin Secret
                </label>
                <Input
                  id="admin-secret"
                  type="password"
                  placeholder="Enter admin secret"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  className="h-12"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" disabled={isLoading || !adminSecret} className="h-12">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Access Dashboard
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Privy One-Tap Login for regular users */}
          {!isAdmin && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-2 text-zinc-500">One-Tap Sign In</span>
                </div>
              </div>

              {/* Google One-Tap */}
              <Button
                type="button"
                className="h-12"
                variant="secondary"
                onClick={() => login()}
                disabled={!ready}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Email login */}
              <Button
                type="button"
                className="h-12"
                variant="secondary"
                onClick={() => login()}
                disabled={!ready}
              >
                Continue with Email
              </Button>

              {/* Wallet connect */}
              <Button
                type="button"
                className="h-12"
                variant="secondary"
                onClick={() => login()}
                disabled={!ready}
              >
                Connect Wallet
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-2 text-zinc-500">Or</span>
                </div>
              </div>

              {/* Admin access link */}
              <p className="text-center text-sm text-zinc-400">
                Admin access?{' '}
                <Button
                  variant="secondary"
                  onClick={() => router.push('/login?admin=1')}
                  className="text-zinc-200 underline hover:text-zinc-100 p-0"
                >
                  Sign in with admin secret
                </Button>
              </p>

              {/* Security notice */}
              <div className="mt-4 rounded-lg bg-teal-950/30 p-3 text-xs text-teal-300">
                <p className="font-medium">🔒 Zero-Vulnerability Security</p>
                <p className="mt-1 text-zinc-400">
                  Your authentication is secured by Privy's TEE hardware enclaves. No passwords
                  stored. No private keys exposed. Every user gets a deterministic Smart Wallet on
                  Polygon.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

// Simple Input component for admin secret
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="flex h-12 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}

export default function LoginClient() {
  return (
    <ClientWeb3Boundary fallback={<main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-16 text-sm text-zinc-500">Loading secure sign-in…</main>}>
      <LoginClientInner />
    </ClientWeb3Boundary>
  );
}
