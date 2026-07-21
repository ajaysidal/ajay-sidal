import { NextRequest, NextResponse } from 'next/server';
import {
  // Node API
  getBlockNumber,
  getBalance,
  getTransaction,
  getTransactionReceipt,
  // Smart Wallets
  getSmartAccountAddress,
  getSmartAccountBalance,
  // Gas Manager
  getGasPrice,
  getFeeData,
  estimateGas,
  // Bundler API
  submitUserOperation,
  getUserOperationReceipt,
  // Token API
  getTokenBalances,
  getTokenMetadata,
  getNFTBalances,
  getNFTMetadata,
  // Prices API
  getTokenPrices,
  getTokenPriceWithUSD,
  // Transfers API
  getTransactionHistory,
  getERC20Transfers,
  getNFTTransfers,
  // Webhooks
  createTreasuryWebhook,
  getWebhooks,
  removeWebhook,
  // Transaction Simulation API
  simulateTransaction,
  simulateAndEstimate,
  // Utilities
  getGasPriceInUSD,
} from '@/lib/alchemy-sdk';

/**
 * Alchemy API Gateway - Unified endpoint for all 9 Alchemy services
 * 
 * Services:
 * 1. Node API - Core blockchain RPC
 * 2. Smart Wallets - Account Abstraction
 * 3. Gas Manager - Sponsor transactions
 * 4. Bundler API - Bundle user operations
 * 5. Token API - Token balances and metadata
 * 6. Prices API - Real-time USD prices
 * 7. Transfers API - Transaction history
 * 8. Webhooks - Real-time monitoring
 * 9. Transaction Simulation - Simulate before execution
 * 
 * GET /api/alchemy?action={service}&params...
 * POST /api/alchemy { action: '{service}', ...data }
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const address = searchParams.get('address');

  if (!action) {
    return NextResponse.json(
      { 
        error: 'Action parameter required',
        availableActions: [
          // Node API
          'block-number', 'balance', 'transaction', 'transaction-receipt',
          // Smart Wallets
          'smart-account-address', 'smart-account-balance',
          // Gas Manager
          'gas-price', 'fee-data', 'estimate-gas', 'gas-price-usd',
          // Bundler API
          'user-op-receipt',
          // Token API
          'balances', 'token-metadata', 'nft-balances', 'nft-metadata',
          // Prices API
          'prices', 'price-usd',
          // Transfers API
          'history', 'erc20-transfers', 'nft-transfers',
          // Webhooks
          'webhooks',
          // Transaction Simulation
          'simulate',
        ]
      },
      { status: 400 }
    );
  }

  try {
    switch (action) {
      // ========================================================================
      // 1. NODE API
      // ========================================================================
      case 'block-number': {
        const result = await getBlockNumber();
        return NextResponse.json(result);
      }

      case 'balance': {
        if (!address) {
          return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }
        const result = await getBalance(address);
        return NextResponse.json(result);
      }

      case 'transaction': {
        const txHash = searchParams.get('txHash');
        if (!txHash) {
          return NextResponse.json({ error: 'Transaction hash required' }, { status: 400 });
        }
        const result = await getTransaction(txHash);
        return NextResponse.json(result);
      }

      case 'transaction-receipt': {
        const txHash = searchParams.get('txHash');
        if (!txHash) {
          return NextResponse.json({ error: 'Transaction hash required' }, { status: 400 });
        }
        const result = await getTransactionReceipt(txHash);
        return NextResponse.json(result);
      }

      // ========================================================================
      // 2. SMART WALLETS
      // ========================================================================
      case 'smart-account-address': {
        if (!address) {
          return NextResponse.json({ error: 'Owner address required' }, { status: 400 });
        }
        const saltNonce = searchParams.get('saltNonce') || '0';
        const result = await getSmartAccountAddress(address, saltNonce);
        return NextResponse.json(result);
      }

      case 'smart-account-balance': {
        if (!address) {
          return NextResponse.json({ error: 'Account address required' }, { status: 400 });
        }
        const result = await getSmartAccountBalance(address);
        return NextResponse.json(result);
      }

      // ========================================================================
      // 3. GAS MANAGER
      // ========================================================================
      case 'gas-price': {
        const result = await getGasPrice();
        return NextResponse.json(result);
      }

      case 'fee-data': {
        const result = await getFeeData();
        return NextResponse.json(result);
      }

      case 'estimate-gas': {
        const to = searchParams.get('to');
        const from = searchParams.get('from') || address;
        const value = searchParams.get('value') || '0';
        const data = searchParams.get('data') || '0x';
        
        if (!to) {
          return NextResponse.json({ error: 'To address required' }, { status: 400 });
        }
        if (!from) {
          return NextResponse.json({ error: 'From address required' }, { status: 400 });
        }
        
        const result = await estimateGas(to, from, value, data);
        return NextResponse.json(result);
      }

      case 'gas-price-usd': {
        const result = await getGasPriceInUSD();
        return NextResponse.json(result);
      }

      // ========================================================================
      // 4. BUNDLER API
      // ========================================================================
      case 'user-op-receipt': {
        const userOpHash = searchParams.get('userOpHash');
        if (!userOpHash) {
          return NextResponse.json({ error: 'User operation hash required' }, { status: 400 });
        }
        const result = await getUserOperationReceipt(userOpHash);
        return NextResponse.json(result);
      }

      // ========================================================================
      // 5. TOKEN API
      // ========================================================================
      case 'balances': {
        if (!address) {
          return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }
        const tokens = searchParams.getAll('tokens');
        const result = await getTokenBalances(address, tokens.length > 0 ? tokens : undefined);
        return NextResponse.json(result);
      }

      case 'token-metadata': {
        const token = searchParams.get('token');
        if (!token) {
          return NextResponse.json({ error: 'Token address required' }, { status: 400 });
        }
        const result = await getTokenMetadata(token);
        return NextResponse.json(result);
      }

      case 'nft-balances': {
        if (!address) {
          return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }
        const pageKey = searchParams.get('pageKey') || undefined;
        const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : undefined;
        const result = await getNFTBalances(address, { pageKey, pageSize });
        return NextResponse.json(result);
      }

      case 'nft-metadata': {
        const contract = searchParams.get('contract');
        const tokenId = searchParams.get('tokenId');
        if (!contract || !tokenId) {
          return NextResponse.json({ error: 'Contract address and token ID required' }, { status: 400 });
        }
        const result = await getNFTMetadata(contract, tokenId);
        return NextResponse.json(result);
      }

      // ========================================================================
      // 6. PRICES API
      // ========================================================================
      case 'prices': {
        const tokens = searchParams.getAll('tokens');
        if (tokens.length === 0) {
          return NextResponse.json({ error: 'Token addresses required' }, { status: 400 });
        }
        const result = await getTokenPrices(tokens);
        return NextResponse.json(result);
      }

      case 'price-usd': {
        const token = searchParams.get('token');
        if (!token) {
          return NextResponse.json({ error: 'Token address required' }, { status: 400 });
        }
        const result = await getTokenPriceWithUSD(token);
        return NextResponse.json(result);
      }

      // ========================================================================
      // 7. TRANSFERS API
      // ========================================================================
      case 'history': {
        if (!address) {
          return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }
        const fromBlock = searchParams.get('fromBlock');
        const toBlock = searchParams.get('toBlock');
        const maxCount = searchParams.get('maxCount');
        const result = await getTransactionHistory(address, {
          fromBlock: fromBlock ? parseInt(fromBlock) : undefined,
          toBlock: toBlock ? parseInt(toBlock) : undefined,
          maxCount: maxCount ? parseInt(maxCount) : undefined,
        });
        return NextResponse.json(result);
      }

      case 'erc20-transfers': {
        if (!address) {
          return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }
        const fromBlock = searchParams.get('fromBlock');
        const toBlock = searchParams.get('toBlock');
        const maxCount = searchParams.get('maxCount');
        const result = await getERC20Transfers(address, {
          fromBlock: fromBlock ? parseInt(fromBlock) : undefined,
          toBlock: toBlock ? parseInt(toBlock) : undefined,
          maxCount: maxCount ? parseInt(maxCount) : undefined,
        });
        return NextResponse.json(result);
      }

      case 'nft-transfers': {
        if (!address) {
          return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }
        const fromBlock = searchParams.get('fromBlock');
        const toBlock = searchParams.get('toBlock');
        const maxCount = searchParams.get('maxCount');
        const result = await getNFTTransfers(address, {
          fromBlock: fromBlock ? parseInt(fromBlock) : undefined,
          toBlock: toBlock ? parseInt(toBlock) : undefined,
          maxCount: maxCount ? parseInt(maxCount) : undefined,
        });
        return NextResponse.json(result);
      }

      // ========================================================================
      // 8. WEBHOOKS
      // ========================================================================
      case 'webhooks': {
        const result = await getWebhooks();
        return NextResponse.json(result);
      }

      // ========================================================================
      // 9. TRANSACTION SIMULATION
      // ========================================================================
      case 'simulate': {
        const to = searchParams.get('to');
        const from = searchParams.get('from') || address;
        const value = searchParams.get('value') || '0';
        const data = searchParams.get('data') || '0x';
        
        if (!to) {
          return NextResponse.json({ error: 'To address required' }, { status: 400 });
        }
        if (!from) {
          return NextResponse.json({ error: 'From address required' }, { status: 400 });
        }
        
        const result = await simulateAndEstimate({ to, from, value, data });
        return NextResponse.json(result);
      }

      // ========================================================================
      // DEFAULT: Unknown action
      // ========================================================================
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error('Alchemy API GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for Alchemy operations that require request body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { 
          error: 'Action parameter required',
          availableActions: [
            'submit-user-op',
            'create-webhook',
            'simulate-tx',
          ]
        },
        { status: 400 }
      );
    }

    switch (action) {
      // ========================================================================
      // 4. BUNDLER API
      // ========================================================================
      case 'submit-user-op': {
        const { userOp } = body;
        if (!userOp) {
          return NextResponse.json({ error: 'User operation required' }, { status: 400 });
        }
        const result = await submitUserOperation(userOp);
        return NextResponse.json(result);
      }

      // ========================================================================
      // 8. WEBHOOKS
      // ========================================================================
      case 'create-webhook': {
        const { webhookUrl } = body;
        if (!webhookUrl) {
          return NextResponse.json({ error: 'Webhook URL required' }, { status: 400 });
        }
        const result = await createTreasuryWebhook(webhookUrl);
        return NextResponse.json(result);
      }

      case 'remove-webhook': {
        const { webhookId } = body;
        if (!webhookId) {
          return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 });
        }
        const result = await removeWebhook(webhookId);
        return NextResponse.json(result);
      }

      // ========================================================================
      // 9. TRANSACTION SIMULATION
      // ========================================================================
      case 'simulate-tx': {
        const { tx } = body;
        if (!tx || !tx.from || !tx.to) {
          return NextResponse.json({ error: 'Transaction with from and to required' }, { status: 400 });
        }
        const result = await simulateAndEstimate(tx);
        return NextResponse.json(result);
      }

      // ========================================================================
      // DEFAULT: Unknown action
      // ========================================================================
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error('Alchemy API POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
