'use client';

import { AlertTriangle, Shield, Lock } from 'lucide-react';

/**
 * High-Security Maintenance UI
 * Displayed when critical service credentials are missing
 */
interface MaintenanceUIProps {
  serviceName: string;
  missingCredentials: string[];
  isAdmin?: boolean;
}

export function MaintenanceUI({ serviceName, missingCredentials, isAdmin = false }: MaintenanceUIProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian p-6">
      <div className="max-w-md w-full">
        {/* Security Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-950/30">
            <Shield className="h-8 w-8 text-teal-400" />
          </div>

          {/* Title */}
          <h1 className="text-center text-2xl font-bold tracking-tight text-white">
            High-Security Maintenance
          </h1>

          {/* Service Name */}
          <p className="mt-2 text-center text-sm text-zinc-400">
            {serviceName} is temporarily unavailable
          </p>

          {/* Security Notice */}
          <div className="mt-6 rounded-lg bg-zinc-800/50 p-4">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-400" />
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Zero-Trust Security Active
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  This service requires administrator credentials. The system is
                  configured to fail securely - no functionality is exposed without
                  proper authentication.
                </p>
              </div>
            </div>
          </div>

          {/* Missing Credentials (Admin Only) */}
          {isAdmin && (
            <div className="mt-6 rounded-lg border border-red-900/30 bg-red-950/20 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-red-300">
                    Missing Configuration
                  </p>
                  <p className="mt-1 text-xs text-red-400/80">
                    The following environment variables are required:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs font-mono text-red-300">
                    {missingCredentials.map((cred) => (
                      <li key={cred}>• {cred}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {isAdmin ? (
              <div className="text-center text-xs text-zinc-500">
                <p>Configure the missing credentials in your environment,</p>
                <p>then refresh the page to restore service.</p>
              </div>
            ) : (
              <p className="text-center text-sm text-zinc-400">
                Please contact support if this issue persists.
              </p>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Check Status Again
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-600">
          The Sanctuary • Zero-Vulnerability Infrastructure
        </p>
      </div>
    </div>
  );
}

/**
 * Check if OpenProvider is configured
 */
export function isOpenProviderConfigured(): boolean {
  return !!(
    process.env.OPENPROVIDER_USERNAME &&
    process.env.OPENPROVIDER_PASSWORD
  );
}

/**
 * Get missing OpenProvider credentials
 */
export function getMissingOpenProviderCredentials(): string[] {
  const missing: string[] = [];
  
  if (!process.env.OPENPROVIDER_USERNAME) {
    missing.push('OPENPROVIDER_USERNAME');
  }
  if (!process.env.OPENPROVIDER_PASSWORD) {
    missing.push('OPENPROVIDER_PASSWORD');
  }
  
  return missing;
}
