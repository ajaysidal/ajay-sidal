/**
 * Alchemy Services Verification Script
 * Tests all 9 Alchemy services to ensure proper configuration
 * 
 * Run with: npx tsx scripts/verify-alchemy-services.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function section(title: string) {
  log('\n' + '='.repeat(60), colors.cyan);
  log(title, colors.cyan);
  log('='.repeat(60), colors.cyan);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Import Alchemy SDK
async function importAlchemySDK() {
  try {
    const alchemy = await import('../src/lib/alchemy-sdk');
    return { success: true, sdk: alchemy };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to import SDK' 
    };
  }
}

// Test results tracking
const results: { service: string; status: 'pass' | 'fail' | 'skip'; message: string }[] = [];

function recordResult(service: string, status: 'pass' | 'fail' | 'skip', message: string) {
  results.push({ service, status, message });
  
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  const color = status === 'pass' ? colors.green : status === 'fail' ? colors.red : colors.yellow;
  log(`${icon} ${service}: ${message}`, color);
}

// ============================================================================
// 1. NODE API TESTS
// ============================================================================
async function testNodeAPI(sdk: any) {
  section('1. NODE API');
  
  try {
    const blockNumber = await sdk.getBlockNumber();
    if (blockNumber.success) {
      recordResult('Node API - Block Number', 'pass', `Block #${blockNumber.blockNumber}`);
    } else {
      recordResult('Node API - Block Number', 'fail', blockNumber.error);
    }
  } catch (error) {
    recordResult('Node API - Block Number', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  await sleep(200);

  try {
    const balance = await sdk.getBalance(process.env.TREASURY_SAFE_ADDRESS || '0x0');
    if (balance.success) {
      recordResult('Node API - Balance', 'pass', `${balance.balanceInMatic} MATIC`);
    } else {
      recordResult('Node API - Balance', 'fail', balance.error);
    }
  } catch (error) {
    recordResult('Node API - Balance', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  await sleep(200);

  try {
    const gasPrice = await sdk.getGasPrice();
    if (gasPrice.success) {
      recordResult('Node API - Gas Price', 'pass', `${gasPrice.gasPriceInGwei} Gwei`);
    } else {
      recordResult('Node API - Gas Price', 'fail', gasPrice.error);
    }
  } catch (error) {
    recordResult('Node API - Gas Price', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// 2. SMART WALLETS TESTS
// ============================================================================
async function testSmartWallets(sdk: any) {
  section('2. SMART WALLETS');
  
  try {
    const address = await sdk.getSmartAccountAddress(process.env.TREASURY_SAFE_ADDRESS || '0x0');
    if (address.success) {
      recordResult('Smart Wallets - Account Address', 'pass', `Generated: ${address.accountAddress.slice(0, 10)}...`);
    } else {
      recordResult('Smart Wallets - Account Address', 'fail', address.error);
    }
  } catch (error) {
    recordResult('Smart Wallets - Account Address', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  await sleep(200);

  try {
    const balance = await sdk.getSmartAccountBalance(process.env.TREASURY_SAFE_ADDRESS || '0x0');
    if (balance.success) {
      recordResult('Smart Wallets - Account Balance', 'pass', `${balance.balanceInMatic} MATIC`);
    } else {
      recordResult('Smart Wallets - Account Balance', 'fail', balance.error);
    }
  } catch (error) {
    recordResult('Smart Wallets - Account Balance', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// 3. GAS MANAGER TESTS
// ============================================================================
async function testGasManager(sdk: any) {
  section('3. GAS MANAGER');
  
  try {
    const feeData = await sdk.getFeeData();
    if (feeData.success) {
      recordResult('Gas Manager - Fee Data', 'pass', `Base: ${parseFloat(feeData.feeData.lastBaseFeePerGas || '0') / 1e9} Gwei`);
    } else {
      recordResult('Gas Manager - Fee Data', 'fail', feeData.error);
    }
  } catch (error) {
    recordResult('Gas Manager - Fee Data', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  await sleep(200);

  try {
    const gasInUSD = await sdk.getGasPriceInUSD();
    if (gasInUSD.success) {
      recordResult('Gas Manager - Gas Price USD', 'pass', `~$${gasInUSD.estimatedTxCostUSD?.toFixed(6) || '0.000000'}`);
    } else {
      recordResult('Gas Manager - Gas Price USD', 'fail', gasInUSD.error);
    }
  } catch (error) {
    recordResult('Gas Manager - Gas Price USD', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// 4. BUNDLER API TESTS
// ============================================================================
async function testBundlerAPI(sdk: any) {
  section('4. BUNDLER API');
  
  try {
    const receipt = await sdk.getUserOperationReceipt('0x0');
    if (receipt.success) {
      recordResult('Bundler API - User Op Receipt', 'pass', 'Endpoint available (placeholder response)');
    } else {
      recordResult('Bundler API - User Op Receipt', 'fail', receipt.error);
    }
  } catch (error) {
    recordResult('Bundler API - User Op Receipt', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// 5. TOKEN API TESTS
// ============================================================================
async function testTokenAPI(sdk: any) {
  section('5. TOKEN API');
  
  const treasuryAddress = process.env.TREASURY_SAFE_ADDRESS || 'REDACTED_SECRET';
  
  try {
    const balances = await sdk.getTokenBalances(treasuryAddress);
    if (balances.success) {
      recordResult('Token API - Balances', 'pass', `${balances.count} tokens found`);
    } else {
      recordResult('Token API - Balances', 'fail', balances.error);
    }
  } catch (error) {
    recordResult('Token API - Balances', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  await sleep(500);

  try {
    // Test with USDC on Polygon
    const usdcAddress = 'REDACTED_SECRET';
    const metadata = await sdk.getTokenMetadata(usdcAddress);
    if (metadata.success) {
      recordResult('Token API - Metadata', 'pass', `${metadata.metadata.symbol || 'USDC'}`);
    } else {
      recordResult('Token API - Metadata', 'fail', metadata.error);
    }
  } catch (error) {
    recordResult('Token API - Metadata', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  await sleep(500);

  try {
    const nftBalances = await sdk.getNFTBalances(treasuryAddress, { pageSize: 1 });
    if (nftBalances.success) {
      recordResult('Token API - NFT Balances', 'pass', `${nftBalances.totalCount} NFTs`);
    } else {
      recordResult('Token API - NFT Balances', 'fail', nftBalances.error);
    }
  } catch (error) {
    recordResult('Token API - NFT Balances', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// 6. PRICES API TESTS
// ============================================================================
async function testPricesAPI(sdk: any) {
  section('6. PRICES API');
  
  try {
    const usdcAddress = 'REDACTED_SECRET';
    const price = await sdk.getTokenPriceWithUSD(usdcAddress);
    if (price.success) {
      recordResult('Prices API - USD Price', 'pass', `$${price.price?.priceUsd || '0.00'} (${price.price?.source})`);
    } else {
      recordResult('Prices API - USD Price', 'fail', price.error);
    }
  } catch (error) {
    recordResult('Prices API - USD Price', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  await sleep(500);

  try {
    const prices = await sdk.getTokenPrices(['REDACTED_SECRET']);
    if (prices.success) {
      recordResult('Prices API - Batch Prices', 'pass', `${prices.prices.length} tokens priced`);
    } else {
      recordResult('Prices API - Batch Prices', 'fail', prices.error);
    }
  } catch (error) {
    recordResult('Prices API - Batch Prices', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// 7. TRANSFERS API TESTS
// ============================================================================
async function testTransfersAPI(sdk: any) {
  section('7. TRANSFERS API');
  
  const treasuryAddress = process.env.TREASURY_SAFE_ADDRESS || 'REDACTED_SECRET';
  
  try {
    const history = await sdk.getTransactionHistory(treasuryAddress, { maxCount: 5 });
    if (history.success) {
      recordResult('Transfers API - History', 'pass', `${history.totalCount} transfers found`);
    } else {
      recordResult('Transfers API - History', 'fail', history.error);
    }
  } catch (error) {
    recordResult('Transfers API - History', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  await sleep(500);

  try {
    const erc20 = await sdk.getERC20Transfers(treasuryAddress, { maxCount: 5 });
    if (erc20.success) {
      recordResult('Transfers API - ERC20', 'pass', `${erc20.totalCount} ERC20 transfers`);
    } else {
      recordResult('Transfers API - ERC20', 'fail', erc20.error);
    }
  } catch (error) {
    recordResult('Transfers API - ERC20', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  await sleep(500);

  try {
    const nftTransfers = await sdk.getNFTTransfers(treasuryAddress, { maxCount: 5 });
    if (nftTransfers.success) {
      recordResult('Transfers API - NFT Transfers', 'pass', `${nftTransfers.totalCount} NFT transfers`);
    } else {
      recordResult('Transfers API - NFT Transfers', 'fail', nftTransfers.error);
    }
  } catch (error) {
    recordResult('Transfers API - NFT Transfers', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// 8. WEBHOOKS TESTS
// ============================================================================
async function testWebhooks(sdk: any) {
  section('8. WEBHOOKS');
  
  try {
    const webhooks = await sdk.getWebhooks();
    if (webhooks.success) {
      recordResult('Webhooks - Get Webhooks', 'pass', 'Dashboard management available');
    } else {
      recordResult('Webhooks - Get Webhooks', 'fail', webhooks.error);
    }
  } catch (error) {
    recordResult('Webhooks - Get Webhooks', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }

  try {
    const createWebhook = await sdk.createTreasuryWebhook(
      process.env.ALCHEMY_WEBHOOK_URL || 'https://example.com/webhook'
    );
    if (createWebhook.success) {
      recordResult('Webhooks - Create Instructions', 'pass', 'Dashboard setup guide provided');
    } else {
      recordResult('Webhooks - Create Instructions', 'fail', createWebhook.error);
    }
  } catch (error) {
    recordResult('Webhooks - Create Instructions', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// 9. TRANSACTION SIMULATION TESTS
// ============================================================================
async function testTransactionSimulation(sdk: any) {
  section('9. TRANSACTION SIMULATION API');
  
  const treasuryAddress = process.env.TREASURY_SAFE_ADDRESS || 'REDACTED_SECRET';
  
  try {
    // Simulate a simple MATIC transfer (will fail but tests the endpoint)
    const simulation = await sdk.simulateAndEstimate({
      from: treasuryAddress,
      to: treasuryAddress, // Self-transfer for testing
      value: '0', // Zero value for safety
      data: '0x',
    });
    
    if (simulation.success) {
      recordResult('Transaction Simulation - Simulate', 'pass', 'Simulation completed');
    } else {
      recordResult('Transaction Simulation - Simulate', 'fail', simulation.error);
    }
  } catch (error) {
    recordResult('Transaction Simulation - Simulate', 'fail', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
async function main() {
  log('\n🔬 ALCHEMY SERVICES VERIFICATION', colors.cyan);
  log('Testing all 9 Alchemy services on Polygon Mainnet', colors.blue);
  log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}`, colors.yellow);
  log(`API Key: ${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY?.slice(0, 10)}...`, colors.yellow);
  log(`Treasury: ${process.env.TREASURY_SAFE_ADDRESS}`, colors.yellow);

  // Import SDK
  const sdkResult = await importAlchemySDK();
  if (!sdkResult.success) {
    log(`\n❌ Failed to import Alchemy SDK: ${sdkResult.error}`, colors.red);
    process.exit(1);
  }

  const sdk = sdkResult.sdk!;

  // Run all tests
  await testNodeAPI(sdk);
  await sleep(300);
  
  await testSmartWallets(sdk);
  await sleep(300);
  
  await testGasManager(sdk);
  await sleep(300);
  
  await testBundlerAPI(sdk);
  await sleep(300);
  
  await testTokenAPI(sdk);
  await sleep(300);
  
  await testPricesAPI(sdk);
  await sleep(300);
  
  await testTransfersAPI(sdk);
  await sleep(300);
  
  await testWebhooks(sdk);
  await sleep(300);
  
  await testTransactionSimulation(sdk);

  // Summary
  section('SUMMARY');
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  
  log(`\nTotal Tests: ${results.length}`, colors.blue);
  log(`✅ Passed: ${passed}`, colors.green);
  log(`❌ Failed: ${failed}`, failed > 0 ? colors.red : colors.green);
  log(`⚠️  Skipped: ${skipped}`, colors.yellow);
  
  if (failed === 0) {
    log('\n🎉 All services are operational!', colors.green);
  } else {
    log(`\n⚠️  ${failed} service(s) need attention`, colors.yellow);
  }

  // Exit with error code if any tests failed
  process.exit(failed > 0 ? 1 : 0);
}

// Run the verification
main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});
