/**
 * MARZ Sanctuary – Smart Account Bridge (Safe Sovereign Edition)
 *
 * This replaces all Openfort and Alchemy AA logic with:
 * - Local sovereign signer
 * - Safe smart account
 * - viem RPC client
 *
 * All exported function names remain the same for compatibility.
 */

import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';
import {
  createSafeAccount,
  executeSafeTransaction,
  getLocalSigner,
} from '@/lib/sovereignWallet';

// -----------------------------
// Types preserved for compatibility
// -----------------------------

export interface UserOperation {
  sender: string;
  nonce: bigint;
  initCode: string;
  callData: string;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: string;
  signature: string;
}

export interface UserOperationV6 {
  sender: `0x${string}`;
  nonce: bigint;
  initCode: `0x${string}`;
  callData: `0x${string}`;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: `0x${string}`;
  signature: `0x${string}`;
}

export interface SmartAccountSession {
  address: string;
  ownerAddress: string;
  isLoggedIn: boolean;
  loginMethod: string | null;
  policyId?: string;
  expiresAt?: number;
}

export interface GasSponsorshipResult {
  success: boolean;
  userOpHash?: string;
  txHash?: string;
  gasSponsored: boolean;
  gasEstimate?: string;
  error?: string;
}

// -----------------------------
// Smart Account Client (Safe)
// -----------------------------

export type SmartAccountClient = {
  address: `0x${string}`;
  owner: `0x${string}`;
  execute: (to: `0x${string}`, data: `0x${string}`, value?: bigint) => Promise<string>;
};

/**
 * Creates a real Safe smart account client.
 */
export async function createSmartAccountClientFromOpenFort(): Promise<SmartAccountClient> {
  const { address, signer } = await createSafeAccount();
  const owner = getLocalSigner().address as `0x${string}`;

  return {
    address: address as `0x${string}`,
    owner,
    async execute(to, data, value = 0n) {
      const txHash = await executeSafeTransaction(to, data, value);
      return txHash;
    },
  };
}

// -----------------------------
// Deterministic Smart Account Address (Safe)
// -----------------------------

export async function getSmartAccountAddress(
  ownerAddress: string,
): Promise<`0x${string}`> {
  if (!ownerAddress.startsWith('0x')) {
    throw new Error('Invalid owner address');
  }

  const { address } = await createSafeAccount();
  return address as `0x${string}`;
}

// -----------------------------
// Gas Sponsorship (Safe does not use paymasters by default)
// -----------------------------

export async function sponsorUserOperation(): Promise<GasSponsorshipResult> {
  return {
    success: false,
    gasSponsored: false,
    error: 'Gas sponsorship not enabled (Safe sovereign mode)',
  };
}

// -----------------------------
// Gasless Execution (Safe executes directly)
// -----------------------------

export async function executeGaslessTransaction(
  to: `0x${string}`,
  data: `0x${string}`,
  value: bigint = 0n,
  smartAccount?: SmartAccountClient
): Promise<GasSponsorshipResult> {
  try {
    const client = smartAccount || (await createSmartAccountClientFromOpenFort());
    const txHash = await client.execute(to, data, value);

    return {
      success: true,
      gasSponsored: false,
      txHash,
    };
  } catch (err: any) {
    return {
      success: false,
      gasSponsored: false,
      error: err?.message || 'Safe execution failed',
    };
  }
}

// -----------------------------
// Session Storage (unchanged)
// -----------------------------

export const saveSmartAccountSession = (session: SmartAccountSession) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('smart_account_session', JSON.stringify(session));
  }
};

export const getSmartAccountSession = (): SmartAccountSession | null => {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('smart_account_session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem('smart_account_session');
        return null;
      }
      return parsed;
    }
  }
  return null;
};

export const clearSmartAccountSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('smart_account_session');
  }
};

// -----------------------------
// Utility Exports (still valid)
// -----------------------------

export function isAlchemyConfigured(): boolean {
  return false; // No longer used
}

export function getGasManagerPolicyId(): string | undefined {
  return undefined; // No longer used
}

export async function estimateGasForTransaction() {
  return {
    success: false,
    error: 'Gas estimation not implemented in sovereign mode',
  };
}

export async function getCurrentGasPrice() {
  return {
    success: false,
    error: 'Gas price fetch not implemented in sovereign mode',
  };
}
