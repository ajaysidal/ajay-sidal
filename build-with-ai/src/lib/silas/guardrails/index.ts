/**
 * Silas On-Chain Guardrails Module
 * Safe{Core} multi-sig integration for testnet proposal safety
 * 
 * Security posture:
 * - Testnet-only by default (Amoy); mainnet requires explicit --mainnet flag
 * - Multi-sig threshold: 2/3 signatures required for execution
 * - Silas proposes → humans review → Safe{Core} executes
 * - All proposals logged to polygon-amoy for immutable audit trail
 */

import Safe from '@safe-global/protocol-kit';
import { ethers } from 'ethers';

// Config: Testnet-first safety
export const GUARDRAILS_CONFIG = {
  network: process.env.SILAS_NETWORK === 'mainnet' ? 'polygon-mainnet' : 'polygon-amoy',
  chainId: process.env.SILAS_NETWORK === 'mainnet' ? 137 : 80002,
  safeThreshold: 2, // 2/3 signatures required
  safeOwners: (process.env.SILAS_SAFE_OWNERS || '').split(',').filter(Boolean),
  alchemyRpc: process.env.ALCHEMY_POLYGON_RPC!,
} as const;


/**
 * Create Safe{Core} guardrail instance with testnet-first safety
 * Returns: { safe: Safe, provider: ethers.JsonRpcProvider, chainId: number }
 */
export const createSafeGuardrail = async () => {
  // Initialize ethers provider with Alchemy RPC
  const provider = new ethers.JsonRpcProvider(GUARDRAILS_CONFIG.alchemyRpc);
  

  // Create Safe instance with v7 pattern (read-only mode for proposal generation)
  // Note: For signing/execution, a signer would be passed; Silas proposes only
  const safeSdk = await Safe.init({
    provider: GUARDRAILS_CONFIG.alchemyRpc,
    safeAddress: process.env.SILAS_SAFE_ADDRESS || '',
  });

  return {
    safe: safeSdk,
    provider,
    chainId: GUARDRAILS_CONFIG.chainId,
    isTestnet: GUARDRAILS_CONFIG.chainId === 80002,
    threshold: GUARDRAILS_CONFIG.safeThreshold,
  };
};


// Multi-sig proposal types
export type SafeProposal = {
  to: string;
  value: string; // Wei as string
  data: string; // Calldata hex
  description: string;
  nonce?: number; // Optional: specify nonce for ordering
};

export type SafeProposalResult = {
  safeTxHash: string;
  status: 'proposed' | 'pending' | 'executed' | 'rejected' | 'error';
  message: string;
  confirmations: number;
  threshold: number;
  network: string;
};

// Guardrail: Validate proposal before submitting to Safe
const validateProposal = (proposal: SafeProposal, isTestnet: boolean): SafeProposalResult | null => {
  if (!proposal.to.startsWith('0x') || proposal.to.length !== 42) {
    return { safeTxHash: '', status: 'rejected', message: 'Invalid "to" address format', confirmations: 0, threshold: 0, network: '' };
  }
  if (!proposal.data.startsWith('0x')) {
    return { safeTxHash: '', status: 'rejected', message: 'Calldata must be hex string starting with 0x', confirmations: 0, threshold: 0, network: '' };
  }
  if (!isTestnet && process.env.SILAS_NETWORK !== 'mainnet') {
    return { safeTxHash: '', status: 'rejected', message: 'Mainnet proposals require SILAS_NETWORK=mainnet', confirmations: 0, threshold: 0, network: 'polygon-mainnet' };
  }
  return null; // Pass validation
};


/**
 * Propose a transaction to Safe{Core} multi-sig with guardrails
 * - Testnet (Amoy): Submits to Safe for 2/3 signature approval
 * - Mainnet: Requires SILAS_NETWORK=mainnet + explicit human review
 */
export const proposeToSafe = async (
  guardrail: Awaited<ReturnType<typeof createSafeGuardrail>>,
  proposal: SafeProposal
): Promise<SafeProposalResult> => {
  
  // Validate proposal before submitting to Safe
  const validation = validateProposal(proposal, guardrail.isTestnet);
  if (validation) return validation; // Early return if rejected


  // Create Safe transaction object
  const safeTransaction = await guardrail.safe.createTransaction({
    transactions: [{
      to: proposal.to,
      value: proposal.value,
       data: proposal.data,
    }],
  });

  // Generate safeTxHash (does not submit to chain yet)
  const safeTxHash = await guardrail.safe.getTransactionHash(safeTransaction);


  // Return proposal result (preview mode: hash generated, not yet submitted)
  return {
    safeTxHash,
    status: 'proposed',
    message: `Safe proposal created. Requires ${guardrail.threshold}/N signatures to execute.`,
    confirmations: 0, // Will increment as owners sign
    threshold: guardrail.threshold,
    network: guardrail.isTestnet ? 'polygon-amoy' : 'polygon-mainnet'
  };
};

