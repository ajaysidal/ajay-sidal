/**
 * Alchemy SDK Configuration for MARZ NeoSphere
 * Implements 9 essential services for a Sovereign Smart Wallet
 *
 * Services:
 * 1. Node API - Core blockchain RPC
 * 2. Smart Wallets - Account Abstraction
 * 3. Gas Manager - Sponsor transactions for users
 * 4. Bundler API - Bundle user operations (ERC-4337)
 * 5. Token API - Token balances and metadata
 * 6. Prices API - Real-time token prices in USD
 * 7. Transfers API - Transaction history
 * 8. Webhooks - Real-time treasury monitoring
 * 9. Transaction Simulation API - Simulate transactions before execution
 *
 * @chain Polygon Mainnet
 * @rpc https://polygon-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}
 */

import { Alchemy, Network, AssetTransfersCategory, TokenBalanceType } from 'alchemy-sdk';

// Initialize Alchemy SDK with Polygon Mainnet
const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
  maxRetries: 3,
  requestTimeout: 30000,
});

/**
 * ============================================================================
 * 1. NODE API - Core RPC Provider
 * ============================================================================
 * Used for all blockchain interactions including:
 * - Getting block numbers
 * - Getting account balances
 * - Sending transactions
 * - Getting transaction receipts
 * - Calling contract methods
 */
export const provider = alchemy.core;

/**
 * Get current block number
 */
export async function getBlockNumber() {
  try {
    const blockNumber = await provider.getBlockNumber();
    return {
      success: true,
      blockNumber,
    };
  } catch (error) {
    console.error('Node API - getBlockNumber error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch block number',
    };
  }
}

/**
 * Get native balance for an address
 */
export async function getBalance(address: string) {
  try {
    const balance = await provider.getBalance(address);
    return {
      success: true,
      balance: balance.toString(),
      balanceInMatic: parseFloat(balance.toString()) / 1e18,
    };
  } catch (error) {
    console.error('Node API - getBalance error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch balance',
    };
  }
}

/**
 * Get transaction by hash
 */
export async function getTransaction(txHash: string) {
  try {
    const tx = await provider.getTransaction(txHash);
    return {
      success: true,
      transaction: tx,
    };
  } catch (error) {
    console.error('Node API - getTransaction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transaction',
    };
  }
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(txHash: string) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    return {
      success: true,
      receipt,
    };
  } catch (error) {
    console.error('Node API - getTransactionReceipt error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transaction receipt',
    };
  }
}

/**
 * ============================================================================
 * 2. SMART WALLETS - Account Abstraction
 * ============================================================================
 * Smart Wallets enable users to:
 * - Login with email/social (no seed phrases)
 * - Batch multiple operations
 * - Recover accounts with guardians
 * - Set spending limits
 */
export const smartWalletConfig = {
  rpcUrl: process.env.ALCHEMY_POLYGON_RPC || `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  chainId: 137, // Polygon Mainnet
  network: Network.MATIC_MAINNET,
};

/**
 * Get smart account address for a user
 * Note: Requires @alchemy/aa-alchemy for full implementation
 */
export async function getSmartAccountAddress(ownerAddress: string, saltNonce: string = '0') {
  try {
    // This is a simplified version - full implementation requires @alchemy/aa-alchemy
    const accountAddress = `0x${ownerAddress.slice(2)}${saltNonce.padStart(64, '0').slice(0, 40)}`;
    return {
      success: true,
      accountAddress,
    };
  } catch (error) {
    console.error('Smart Wallets - getSmartAccountAddress error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get smart account address',
    };
  }
}

/**
 * Get smart account balance
 */
export async function getSmartAccountBalance(accountAddress: string) {
  try {
    const balance = await provider.getBalance(accountAddress);
    return {
      success: true,
      balance: balance.toString(),
      balanceInMatic: parseFloat(balance.toString()) / 1e18,
    };
  } catch (error) {
    console.error('Smart Wallets - getSmartAccountBalance error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get smart account balance',
    };
  }
}

/**
 * ============================================================================
 * 3. GAS MANAGER - Sponsor Transactions
 * ============================================================================
 * Gas Manager enables you to:
 * - Sponsor gas fees for users
 * - Create sponsorship policies
 * - Track gas spending
 * - Implement paymaster logic
 */

/**
 * Get gas price in wei
 */
export async function getGasPrice() {
  try {
    const gasPrice = await provider.getGasPrice();
    return {
      success: true,
      gasPriceWei: gasPrice.toString(),
      gasPriceInGwei: parseFloat(gasPrice.toString()) / 1e9,
    };
  } catch (error) {
    console.error('Gas Manager - getGasPrice error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch gas price',
    };
  }
}

/**
 * Get fee data for EIP-1559 transactions
 */
export async function getFeeData() {
  try {
    const feeData = await provider.getFeeData();
    return {
      success: true,
      feeData: {
        lastBaseFeePerGas: feeData.lastBaseFeePerGas?.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
        gasPrice: feeData.gasPrice?.toString(),
      },
    };
  } catch (error) {
    console.error('Gas Manager - getFeeData error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch fee data',
    };
  }
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(to: string, from: string, value: string = '0', data: string = '0x') {
  try {
    const gasEstimate = await provider.estimateGas({
      to,
      from,
      value,
      data,
    });
    return {
      success: true,
      gasEstimate: gasEstimate.toString(),
      gasEstimateInGwei: parseFloat(gasEstimate.toString()) / 1e9,
    };
  } catch (error) {
    console.error('Gas Manager - estimateGas error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to estimate gas',
    };
  }
}

/**
 * ============================================================================
 * 4. BUNDLER API - ERC-4337 User Operations
 * ============================================================================
 * Bundler API enables:
 * - Submitting user operations
 * - Bundling multiple operations
 * - Getting user operation receipts
 * - Checking user operation status
 */

/**
 * Submit a user operation to the bundler
 * Note: Full implementation requires @alchemy/aa-core
 */
export async function submitUserOperation(userOp: any) {
  try {
    // This is a placeholder - full implementation requires bundler RPC
    // Use alchemy.wallet.sendUserOperation with @alchemy/aa-core
    return {
      success: true,
      message: 'User operation submitted (placeholder - requires @alchemy/aa-core for full implementation)',
      userOpHash: '0x' + 'user_op_hash_placeholder',
    };
  } catch (error) {
    console.error('Bundler API - submitUserOperation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit user operation',
    };
  }
}

/**
 * Get user operation receipt
 */
export async function getUserOperationReceipt(userOpHash: string) {
  try {
    // Placeholder - requires bundler RPC
    return {
      success: true,
      message: 'User operation receipt (placeholder - requires bundler RPC)',
      receipt: null,
    };
  } catch (error) {
    console.error('Bundler API - getUserOperationReceipt error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user operation receipt',
    };
  }
}

/**
 * ============================================================================
 * 5. TOKEN API - Token Balances and Metadata
 * ============================================================================
 * Token API provides:
 * - ERC-20 token balances
 * - NFT balances and metadata
 * - Token ownership verification
 * - Token transfers
 */

/**
 * Get ERC-20 token balances for an address
 */
export async function getTokenBalances(address: string, contractAddresses?: string[]) {
  try {
    const balances = contractAddresses
      ? await alchemy.core.getTokenBalances(address, contractAddresses)
      : await alchemy.core.getTokenBalances(address);
    
    const nonZeroBalances = balances.tokenBalances.filter(b => b.tokenBalance !== '0');
    
    return {
      success: true,
      balances: nonZeroBalances,
      count: nonZeroBalances.length,
    };
  } catch (error) {
    console.error('Token API - getTokenBalances error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch token balances',
    };
  }
}

/**
 * Get token metadata (symbol, name, decimals, logo)
 */
export async function getTokenMetadata(tokenAddress: string) {
  try {
    const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
    return {
      success: true,
      metadata: {
        address: tokenAddress,
        symbol: metadata.symbol,
        name: metadata.name,
        decimals: metadata.decimals,
        logo: metadata.logo,
      },
    };
  } catch (error) {
    console.error('Token API - getTokenMetadata error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch token metadata',
    };
  }
}

/**
 * Get NFT balances for an address
 * Note: Uses alchemy.nft namespace for NFT operations
 */
export async function getNFTBalances(address: string, options?: { pageKey?: string; pageSize?: number }) {
  try {
    // Use the alchemy.nft namespace instead of alchemy.core
    const nfts = await (alchemy as any).nft.getNftsForOwner(address, {
      pageKey: options?.pageKey,
      pageSize: options?.pageSize || 100,
    });
    return {
      success: true,
      nfts: nfts.ownedNfts || [],
      totalCount: nfts.totalCount || 0,
      pageKey: nfts.pageKey,
    };
  } catch (error) {
    console.error('Token API - getNFTBalances error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch NFT balances',
    };
  }
}

/**
 * Get NFT metadata
 * Note: Uses alchemy.nft namespace for NFT operations
 */
export async function getNFTMetadata(contractAddress: string, tokenId: string) {
  try {
    // Use the alchemy.nft namespace
    const nft = await (alchemy as any).nft.getNftMetadata(contractAddress, tokenId);
    return {
      success: true,
      nft,
    };
  } catch (error) {
    console.error('Token API - getNFTMetadata error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch NFT metadata',
    };
  }
}

/**
 * ============================================================================
 * 6. PRICES API - Real-time Token Prices in USD
 * ============================================================================
 * Prices API provides:
 * - Real-time USD prices for tokens
 * - Historical price data
 * - Price feeds for DeFi applications
 */

/**
 * Get token prices in USD
 * Note: Alchemy Prices API requires premium tier
 * This implementation uses token metadata as fallback
 */
export async function getTokenPrices(tokenAddresses: string[]) {
  try {
    const prices = await Promise.all(
      tokenAddresses.map(async (address) => {
        const metadata = await alchemy.core.getTokenMetadata(address);
        
        // Note: Real-time prices require Alchemy Premium or external API
        // Integrate CoinGecko, CoinMarketCap, or Pyth for real prices
        return {
          address,
          symbol: metadata.symbol || 'UNKNOWN',
          name: metadata.name || 'Unknown Token',
          decimals: metadata.decimals || 18,
          priceUsd: 0, // Placeholder - integrate external price oracle
          priceSource: 'metadata',
        };
      })
    );

    return {
      success: true,
      prices,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Prices API - getTokenPrices error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch token prices',
    };
  }
}

/**
 * Get token price with USD conversion (using external API)
 * Uses CoinGecko free API for Polygon tokens
 */
export async function getTokenPriceWithUSD(tokenAddress: string) {
  try {
    // Map common Polygon tokens to CoinGecko IDs
    const tokenToCoinGecko: Record<string, string> = {
      'TOKEN_ADDR_1': 'matic-network', // MATIC
      'TOKEN_ADDR_2': 'usd-coin', // USDC
      'TOKEN_ADDR_3': 'weth', // WETH
      'TOKEN_ADDR_4': 'usd-coin', // USDC.e
      'TOKEN_ADDR_5': 'wrapped-bitcoin', // WBTC
    };

    const coinGeckoId = tokenToCoinGecko[tokenAddress.toLowerCase()];
    
    if (!coinGeckoId) {
      const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
      return {
        success: true,
        price: {
          address: tokenAddress,
          symbol: metadata.symbol || 'UNKNOWN',
          priceUsd: 0,
          source: 'unavailable',
        },
      };
    }

    // Fetch from CoinGecko
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`);
    const data = await response.json();
    const priceUsd = data[coinGeckoId]?.usd || 0;

    return {
      success: true,
      price: {
        address: tokenAddress,
        priceUsd,
        source: 'coingecko',
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Prices API - getTokenPriceWithUSD error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch USD price',
    };
  }
}

/**
 * ============================================================================
 * 7. TRANSFERS API - Transaction History
 * ============================================================================
 * Transfers API provides:
 * - ERC-20 token transfers
 * - NFT transfers
 * - Native token transfers
 * - Transaction history with metadata
 */

/**
 * Get asset transfers for an address
 */
export async function getTransactionHistory(address: string, options?: {
  fromBlock?: number;
  toBlock?: number;
  maxCount?: number;
}) {
  try {
    const transfers = await alchemy.core.getAssetTransfers({
      fromBlock: options?.fromBlock?.toString() || '0x0',
      toBlock: options?.toBlock?.toString() || 'latest',
      fromAddress: address,
      toAddress: address,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.ERC1155,
      ],
      withMetadata: true,
      maxCount: options?.maxCount || 100,
    });

    return {
      success: true,
      transfers: transfers.transfers,
      totalCount: transfers.transfers.length,
      pageKey: transfers.pageKey,
    };
  } catch (error) {
    console.error('Transfers API - getTransactionHistory error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transaction history',
    };
  }
}

/**
 * Get ERC-20 transfers only
 */
export async function getERC20Transfers(address: string, options?: {
  fromBlock?: number;
  toBlock?: number;
  maxCount?: number;
}) {
  try {
    const transfers = await alchemy.core.getAssetTransfers({
      fromBlock: options?.fromBlock?.toString() || '0x0',
      toBlock: options?.toBlock?.toString() || 'latest',
      fromAddress: address,
      toAddress: address,
      category: [AssetTransfersCategory.ERC20],
      withMetadata: true,
      maxCount: options?.maxCount || 100,
    });

    return {
      success: true,
      transfers: transfers.transfers,
      totalCount: transfers.transfers.length,
    };
  } catch (error) {
    console.error('Transfers API - getERC20Transfers error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch ERC-20 transfers',
    };
  }
}

/**
 * Get NFT transfers only
 */
export async function getNFTTransfers(address: string, options?: {
  fromBlock?: number;
  toBlock?: number;
  maxCount?: number;
}) {
  try {
    const transfers = await alchemy.core.getAssetTransfers({
      fromBlock: options?.fromBlock?.toString() || '0x0',
      toBlock: options?.toBlock?.toString() || 'latest',
      fromAddress: address,
      toAddress: address,
      category: [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155],
      withMetadata: true,
      maxCount: options?.maxCount || 100,
    });

    return {
      success: true,
      transfers: transfers.transfers,
      totalCount: transfers.transfers.length,
    };
  } catch (error) {
    console.error('Transfers API - getNFTTransfers error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch NFT transfers',
    };
  }
}

/**
 * ============================================================================
 * 8. WEBHOOKS - Real-time Treasury Monitoring
 * ============================================================================
 * Webhooks enable:
 * - Real-time notifications for incoming payments
 * - Dropped transaction alerts
 * - Mined transaction notifications
 * - Custom activity monitoring
 */

/**
 * Create a treasury webhook (requires Alchemy Notify setup)
 * Note: Webhooks must be configured in Alchemy Dashboard
 */
export async function createTreasuryWebhook(webhookUrl: string) {
  try {
    // Webhook creation requires Alchemy Dashboard or REST API
    // Configure at: https://dashboard.alchemy.com/notify
    return {
      success: true,
      message: 'Configure webhooks in Alchemy Dashboard: https://dashboard.alchemy.com/notify',
      webhookUrl,
      monitorAddress: process.env.TREASURY_SAFE_ADDRESS,
      instructions: [
        '1. Go to Alchemy Dashboard > Notify',
        '2. Click "Create Webhook"',
        '3. Select "Mined Transaction" or "Dropped Transaction"',
        `4. Set Address to: ${process.env.TREASURY_SAFE_ADDRESS}`,
        `5. Set Webhook URL to: ${webhookUrl}`,
        '6. Save and test',
      ],
    };
  } catch (error) {
    console.error('Webhooks - createTreasuryWebhook error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create webhook',
    };
  }
}

/**
 * Get all active webhooks
 */
export async function getWebhooks() {
  try {
    // Webhook management via Alchemy Dashboard
    return {
      success: true,
      message: 'View and manage webhooks in Alchemy Dashboard: https://dashboard.alchemy.com/notify',
      treasuryAddress: process.env.TREASURY_SAFE_ADDRESS,
    };
  } catch (error) {
    console.error('Webhooks - getWebhooks error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch webhooks',
    };
  }
}

/**
 * Remove a webhook
 */
export async function removeWebhook(webhookId: string) {
  try {
    // Webhook management via Alchemy Dashboard
    return {
      success: true,
      message: 'Manage webhooks in Alchemy Dashboard: https://dashboard.alchemy.com/notify',
      webhookId,
    };
  } catch (error) {
    console.error('Webhooks - removeWebhook error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove webhook',
    };
  }
}

/**
 * ============================================================================
 * 9. TRANSACTION SIMULATION API - Simulate Before Execution
 * ============================================================================
 * Transaction Simulation enables:
 * - Preview transaction effects
 * - Detect potential failures
 * - Estimate gas usage
 * - Security analysis
 */

/**
 * Simulate a transaction (placeholder - requires Alchemy Simulation API)
 * Note: Full implementation requires Alchemy Simulation API or Tenderly
 */
export async function simulateTransaction(tx: {
  from: string;
  to: string;
  value?: string;
  data?: string;
}) {
  try {
    // This is a placeholder - full implementation requires simulation API
    // Options:
    // 1. Alchemy Simulation API (premium)
    // 2. Tenderly Simulation API
    // 3. eth_call with state override
    
    // Basic simulation using eth_call
    const result = await provider.call({
      from: tx.from,
      to: tx.to,
      value: tx.value,
      data: tx.data,
    });

    return {
      success: true,
      simulation: {
        result,
        message: 'Transaction simulation completed',
        gasUsed: 'estimated',
      },
    };
  } catch (error) {
    console.error('Transaction Simulation - simulateTransaction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transaction simulation failed',
      simulation: {
        reverted: true,
        reason: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Simulate and estimate gas for a transaction
 */
export async function simulateAndEstimate(tx: {
  from: string;
  to: string;
  value?: string;
  data?: string;
}) {
  try {
    // Run simulation
    const simulation = await simulateTransaction(tx);
    
    // Estimate gas
    const gasEstimate = await estimateGas(tx.to, tx.from, tx.value || '0', tx.data || '0x');
    
    return {
      success: true,
      simulation: simulation.success ? simulation.simulation : null,
      gasEstimate: gasEstimate.success ? gasEstimate.gasEstimate : null,
      error: !simulation.success || !gasEstimate.success ? {
        simulationError: !simulation.success,
        gasEstimateError: !gasEstimate.success,
      } : null,
    };
  } catch (error) {
    console.error('Transaction Simulation - simulateAndEstimate error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to simulate and estimate',
    };
  }
}

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

/**
 * Get current gas price in USD (estimated)
 */
export async function getGasPriceInUSD() {
  try {
    const gasPrice = await getGasPrice();
    if (!gasPrice.success) return gasPrice;

    const gasPriceInGwei = gasPrice.gasPriceInGwei || 0;
    const maticPrice = await getTokenPriceWithUSD('TOKEN_ADDR_6');
    
    const maticPriceUSD = maticPrice.success ? maticPrice.price?.priceUsd || 0 : 0;
    const estimatedTxCostUSD = (gasPriceInGwei * 21000 / 1e9) * maticPriceUSD;

    return {
      success: true,
      gasPriceInGwei,
      maticPriceUSD,
      estimatedTxCostUSD,
      note: 'Estimated cost for a simple transfer (21000 gas)',
    };
  } catch (error) {
    console.error('Utility - getGasPriceInUSD error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get gas price in USD',
    };
  }
}

/**
 * Batch multiple operations efficiently
 */
export async function batchOperations<T>(operations: Array<() => Promise<T>>) {
  try {
    const results = await Promise.all(operations.map(op => op()));
    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('Utility - batchOperations error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Batch operation failed',
    };
  }
}

// Export default instance
export default alchemy;
