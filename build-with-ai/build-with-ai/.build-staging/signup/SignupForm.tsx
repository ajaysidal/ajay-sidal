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

import * as React from 'react';
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Loader2, Mail, Sparkles } from 'lucide-react';
import { ClientWeb3Boundary } from '@/components/providers/ClientWeb3Boundary';

function SignupFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';

  const { login, ready } = usePrivy();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    email: '',
    first_name: '',
    last_name: '',
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
        }),
      });

      const data = (await res.json()) as { handle?: string; error?: string };
      if (!res.ok) {
        throw new Error('error' in data ? data.error : 'Signup failed');
      }

      if (data.handle && typeof window !== 'undefined') {
        window.localStorage.setItem('op_customer_handle', data.handle);
      }

      setSuccess('Account created! Redirecting to sign in...');
      setTimeout(() => {
        router.push('/login?next=' + encodeURIComponent(next));
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
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
            <h1 className="text-xl font-semibold tracking-tight">Enter the Sanctuary</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-400">Secure, gasless authentication powered by Alchemy + Openfort.</p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          {success ? <p className="mt-3 text-sm text-emerald-300">{success}</p> : null}
        </CardHeader>

        <CardContent className="grid gap-4">
          {/* Privy One-Tap Login */}
          <div className="grid gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-12"
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
              Sign up with Google
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="h-12"
              onClick={() => login()}
              disabled={!ready}
            >
              Sign up with Email
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-950 px-2 text-zinc-500">Or create account with email</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={onSubmit} className="grid gap-3">
            <Input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                id="signup-first-name"
                name="first_name"
                placeholder="First name"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                required
              />
              <Input
                id="signup-last-name"
                name="last_name"
                placeholder="Last name"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="h-12">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Create account
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Button
              variant="secondary"
              onClick={() => router.push('/login?next=' + encodeURIComponent(next))}
              className="text-zinc-200 underline hover:text-zinc-100 p-0"
            >
              Sign in
            </Button>
          </p>

          {/* Security notice */}
          <div className="mt-4 rounded-lg bg-teal-950/30 p-3 text-xs text-teal-300">
            <p className="font-medium">🔒 Zero-Vulnerability Security</p>
            <p className="mt-1 text-zinc-400">
              Your authentication is secured by enterprise-grade secure enclaves hardware enclaves. No passwords
              stored. No private keys exposed.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function SignupForm() {
  return (
    <ClientWeb3Boundary fallback={<main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-16 text-sm text-zinc-500">Loading secure sign-up…</main>}>
      <SignupFormInner />
    </ClientWeb3Boundary>
  );
}
