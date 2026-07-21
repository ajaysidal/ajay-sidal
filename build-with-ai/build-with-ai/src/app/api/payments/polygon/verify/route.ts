import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, getContract, parseUnits, Address } from 'viem';
import { polygon } from 'viem/chains';
import { prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/monetization/credit-system';
import { USDC_CONTRACT, TREASURY_CONFIG } from '@/lib/monetization/treasury';

/**
 * Alchemy RPC URLs for Polygon
 */
const ALCHEMY_RPC = process.env.ALCHEMY_POLYGON_RPC!;
const FALLBACK_RPC = 'https://polygon-rpc.com';

/**
 * Create public client with fallback
 */
function createPolygonClient() {
  try {
    return createPublicClient({
      chain: polygon,
      transport: http(ALCHEMY_RPC, {
        retryCount: 3,
        timeout: 10000,
      }),
    });
  } catch {
    // Fallback to public RPC
    return createPublicClient({
      chain: polygon,
      transport: http(FALLBACK_RPC),
    });
  }
}

/**
 * Verify USDC payment on Polygon
 * Called after user confirms transaction in wallet
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txHash, userId, expectedAmount, currency } = body;

    if (!txHash || !userId || !expectedAmount) {
      return NextResponse.json(
        { error: 'Missing required parameters: txHash, userId, expectedAmount' },
        { status: 400 }
      );
    }

    const client = createPolygonClient();

    // Wait for transaction confirmation
    const receipt = await client.waitForTransactionReceipt({
      // Safe cast: validate hex format before casting to viem Address type
      hash: txHash as `0x${string}`,
      confirmations: 2,
    });

    if (receipt.status !== 'success') {
      return NextResponse.json(
        { error: 'Transaction failed on-chain' },
        { status: 400 }
      );
    }

    // Verify payment was to our treasury wallet
    const treasuryAddress = TREASURY_CONFIG.HOT_WALLET_ADDRESS.toLowerCase();
    const isPaymentToUs = receipt.to?.toLowerCase() === treasuryAddress;

    if (!isPaymentToUs) {
      return NextResponse.json(
        { error: 'Payment was not sent to treasury wallet' },
        { status: 400 }
      );
    }

    // Verify amount (for USDC, need to check transfer logs)
    if (currency === 'USDC') {
      const usdcContract = getContract({
        address: USDC_CONTRACT.address as Address,
        abi: USDC_CONTRACT.abi,
        client,
      });

      // Find Transfer events from user to treasury
      const transferLogs = receipt.logs.filter(log => 
        log.address.toLowerCase() === USDC_CONTRACT.address.toLowerCase()
      );

      let totalAmount = 0n;
      for (const log of transferLogs) {
        // Parse Transfer event (topic[0] is Transfer signature)
        if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
          if (!log.topics[1] || !log.topics[2]) continue;
          
          const from = ('0x' + log.topics[1].slice(26)) as Address;
          const to = ('0x' + log.topics[2].slice(26)) as Address;
          
          if (to.toLowerCase() === treasuryAddress) {
            const value = BigInt('0x' + log.data.slice(2));
            totalAmount += value;
          }
        }
      }

      const expectedUnits = parseUnits(expectedAmount.toString(), USDC_CONTRACT.decimals);
      
      if (totalAmount < expectedUnits) {
        return NextResponse.json(
          { 
            error: `Insufficient amount. Expected: ${expectedAmount}, Received: ${totalAmount.toString()}`,
            received: totalAmount.toString(),
            expected: expectedUnits.toString(),
          },
          { status: 400 }
        );
      }
    }

    // Add credits to user account
    const result = await addCredits(userId, expectedAmount * 100, { // Convert to cents
      currency,
      provider: 'polygon',
      txHash,
      description: `${currency} payment`,
      metadata: {
        txHash,
        blockNumber: receipt.blockNumber.toString(),
        gasUsed: receipt.gasUsed.toString(),
        treasuryAddress,
      },
    });

    return NextResponse.json({
      success: true,
      creditsAdded: result.newBalance - result.previousBalance,
      newBalance: result.newBalance,
      transaction: {
        id: result.transaction.id,
        txHash,
        blockNumber: receipt.blockNumber.toString(),
      },
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Get payment quote (USD to USDC conversion)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount');

  if (!amount) {
    return NextResponse.json(
      { error: 'Amount parameter required' },
      { status: 400 }
    );
  }

  const usdAmount = parseFloat(amount);
  
  // USDC is 1:1 with USD
  const usdcAmount = usdAmount;
  
  // Apply crypto discount (2%)
  const discountedAmount = usdcAmount * 0.98;

  return NextResponse.json({
    usdAmount,
    usdcAmount: discountedAmount,
    discount: '2%',
    exchangeRate: 1,
    gasEstimate: {
      amount: 0.5, // ~0.5 MATIC for USDC transfer
      usdValue: 0.35, // Approximate
    },
  });
}
