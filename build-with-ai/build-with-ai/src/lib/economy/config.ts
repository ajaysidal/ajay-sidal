/**
 * Opsvantage Economic Configuration
 * Ensures profitability by decoupling Hard Costs (USD) from Rewards (MARZ)
 */

export const ECONOMIC_CONFIG = {
  // 1. The Exchange Rate (Internal Valuation)
  // 1000 MARZ = $1.00 USD discount value
  marzToUsdRate: 1000,

  // 2. Reward Constraints
  maxDailyRewardPerUser: 10, // Max 10 MARZ per day per user
  maxRewardPerInteraction: 1, // Max 1 MARZ per chat

  // 3. Wholesale Protection
  // Minimum USD required for "Hard" products (Domains/Hosting)
  // MARZ cannot be used to pay 100% of a hard cost.
  minUsdPaymentRatio: 0.20, // User must pay at least 20% in USD

  // 4. The "Living Expense" Buffer
  // Percentage of revenue set aside before payouts
  treasuryReservePercent: 0.15 
} as const;
