/**
 * Treasury Management Configuration
 * Sovereign-grade fund security with multi-sig protection
 */

/**
 * Gnosis Safe Multi-Sig Wallet Configuration
 * Deploy at: https://app.safe.global
 * 
 * Setup Instructions:
 * 1. Create Safe on Polygon Mainnet (Chain ID: 137)
 * 2. Add 3 trusted signers (you + 2 advisors/partners)
 * 3. Set threshold: 2-of-3 signatures required
 * 4. Transfer 95% of funds here from hot wallet
 */
export const TREASURY_CONFIG = {
  /**
   * Gnosis Safe Multi-Sig Address (DEPLOY THIS)
   * 2-of-3 signers required for any withdrawal
   */
  SAFE_MULTISIG_ADDRESS: process.env.TREASURY_SAFE_ADDRESS || '',
  
  /**
   * Hot Wallet Address (Daily Operations)
   * Holds 5% of funds for immediate operations
   * Auto-sweeps to Safe when balance > threshold
   */
  HOT_WALLET_ADDRESS: process.env.TREASURY_HOT_WALLET || '',
  
  /**
   * Auto-sweep threshold (in USDC, 6 decimals)
   * When hot wallet exceeds this, auto-transfer to Safe
   */
  AUTO_SWEEP_THRESHOLD: 1000_000_000, // 1000 USDC
  
  /**
   * Maximum daily withdrawal from hot wallet (in USDC)
   * Requires manual approval above this amount
   */
  DAILY_WITHDRAWAL_LIMIT: 10_000_000_000, // 10,000 USDC
  
  /**
   * Chain ID for Polygon Mainnet
   */
  CHAIN_ID: 137,
} as const;

/**
 * USDC Token Contract on Polygon
 */
export const USDC_CONTRACT = {
  address: 'REDACTED_SECRET',
  abi: [
    {
      inputs: [{ name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ] as const,
  decimals: 6, // USDC on Polygon uses 6 decimals
};

/**
 * Revenue Split Configuration
 */
export const REVENUE_CONFIG = {
  /**
   * Stripe fee percentage (2.9%)
   */
  STRIPE_FEE_PERCENT: 2.9,
  
  /**
   * Stripe fixed fee (in cents)
   */
  STRIPE_FIXED_FEE: 30,
  
  /**
   * Crypto discount incentive (2% off for USDC payments)
   */
  CRYPTO_DISCOUNT_PERCENT: 2,
  
  /**
   * MATIC auto-swap slippage tolerance (0.5%)
   */
  MATIC_SWAP_SLIPPAGE: 50, // 0.5% in basis points
} as const;

/**
 * Dispute Handling Configuration
 */
export const DISPUTE_CONFIG = {
  /**
   * Auto-accept disputes below this amount (in cents)
   * Not worth fighting small disputes
   */
  AUTO_ACCEPT_THRESHOLD: 10000, // $100
  
  /**
   * Days to respond to dispute before deadline
   * Stripe gives 7 days typically
   */
  DISPUTE_RESPONSE_DAYS: 5,
  
  /**
   * Alert admins via email/SMS when dispute created
   */
  ALERT_ON_DISPUTE: true,
} as const;

/**
 * Get treasury wallet addresses
 */
export function getTreasuryAddresses() {
  return {
    safe: TREASURY_CONFIG.SAFE_MULTISIG_ADDRESS,
    hot: TREASURY_CONFIG.HOT_WALLET_ADDRESS,
  };
}

/**
 * Validate treasury configuration
 */
export function validateTreasuryConfig() {
  const errors: string[] = [];
  
  if (!TREASURY_CONFIG.SAFE_MULTISIG_ADDRESS) {
    errors.push('TREASURY_SAFE_ADDRESS not configured in .env.local');
  }
  
  if (!TREASURY_CONFIG.HOT_WALLET_ADDRESS) {
    errors.push('TREASURY_HOT_WALLET not configured in .env.local');
  }
  
  // Validate address format (basic check)
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (TREASURY_CONFIG.SAFE_MULTISIG_ADDRESS && 
      !addressRegex.test(TREASURY_CONFIG.SAFE_MULTISIG_ADDRESS)) {
    errors.push('TREASURY_SAFE_ADDRESS is not a valid Ethereum address');
  }
  
  if (TREASURY_CONFIG.HOT_WALLET_ADDRESS && 
      !addressRegex.test(TREASURY_CONFIG.HOT_WALLET_ADDRESS)) {
    errors.push('TREASURY_HOT_WALLET is not a valid Ethereum address');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
