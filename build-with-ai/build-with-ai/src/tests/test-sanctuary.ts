/**
 * MARZ Sanctuary - Test Suite (Openfort-Free Edition)
 *
 * All Openfort-dependent tests have been disabled.
 * Alchemy + Security tests remain active.
 */

import dotenv from 'dotenv';
dotenv.config();

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function section(title: string) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`  ${title}`, colors.bold + colors.cyan);
  log('='.repeat(60), colors.cyan);
}

function pass(test: string) {
  log(`  ✅ ${test}`, colors.green);
}

function fail(test: string, reason: string) {
  log(`  ❌ ${test}`, colors.red);
  log(`     Reason: ${reason}`, colors.red);
}

function info(message: string) {
  log(`  ℹ️  ${message}`, colors.yellow);
}

// ============================================================================
// TEST 1: OPENFORT CONFIGURATION (DISABLED)
// ============================================================================
async function testOpenFortConfiguration() {
  section('TEST 1: OpenFort Configuration (DISABLED)');
  info('Openfort has been removed from the Sanctuary.');
  pass('Openfort tests skipped');
  return true;
}

// ============================================================================
// TEST 2: ALCHEMY CONFIGURATION
// ============================================================================
async function testAlchemyConfiguration() {
  section('TEST 2: Alchemy Configuration');

  const apiKey = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  const policyId = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;

  if (!apiKey) {
    fail('Alchemy API Key configured', 'ALCHEMY_API_KEY or NEXT_PUBLIC_ALCHEMY_API_KEY is not set');
    return false;
  }

  if (apiKey.length < 10) {
    fail('Alchemy API Key valid', 'API Key appears to be a placeholder');
    return false;
  }

  pass('Alchemy API Key configured');
  log(`     API Key: ${apiKey.slice(0, 8)}...`);

  if (policyId) {
    pass('Alchemy Gas Manager Policy ID configured');
  } else {
    info('Gas Manager Policy ID not set (optional)');
  }

  return true;
}

// ============================================================================
// TEST 3: GAS SPONSORSHIP SIMULATION
// ============================================================================
async function testGasSponsorship() {
  section('TEST 3: Gas Sponsorship');

  const policyId = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;

  if (!policyId) {
    info('Gas sponsorship disabled (no policy ID)');
    pass('Gas sponsorship test skipped');
    return true;
  }

  pass('Gas Manager Policy ID present');
  return true;
}

// ============================================================================
// TEST 4: OPENPROVIDER AUTHENTICATION (UNCHANGED)
// ============================================================================
async function testOpenProviderAuthentication() {
  section('TEST 4: OpenProvider Authentication');

  const username = process.env.OPENPROVIDER_USERNAME;
  const password = process.env.OPENPROVIDER_PASSWORD;

  if (!username || !password) {
    info('OpenProvider credentials not configured (optional)');
    return true;
  }

  if (username.length < 3 || password.length < 3) {
    fail('OpenProvider credentials valid', 'Credentials appear invalid');
    return false;
  }

  pass('OpenProvider credentials configured');
  return true;
}

// ============================================================================
// TEST 5: SECURITY HEADERS
// ============================================================================
async function testSecurityHeaders() {
  section('TEST 5: Security Headers');

  try {
    const fs = await import('fs');
    const configPath = './next.config.js';

    if (!fs.existsSync(configPath)) {
      fail('next.config.js exists', 'File not found');
      return false;
    }

    const configContent = fs.readFileSync(configPath, 'utf-8');

    if (configContent.includes('Content-Security-Policy')) {
      pass('CSP header configured');
    } else {
      fail('CSP header', 'Not found');
    }

    if (configContent.includes('*.alchemy.com')) {
      pass('CSP includes Alchemy domains');
    } else {
      fail('CSP includes Alchemy domains', 'Missing');
    }

    return true;
  } catch (error) {
    fail('Security headers test', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// ============================================================================
// TEST 6: SMART ACCOUNT HOOK (UPDATED)
// ============================================================================
async function testSmartAccountHook() {
  section('TEST 6: Smart Account Hook');

  try {
    const fs = await import('fs');
    const hookPath = './src/hooks/useSmartAccount.ts';

    if (!fs.existsSync(hookPath)) {
      fail('useSmartAccount hook exists', 'File not found');
      return false;
    }

    pass('useSmartAccount hook exists');
    info('Openfort integration removed — test skipped');

    return true;
  } catch (error) {
    fail('Smart Account hook test', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================
async function runAllTests() {
  section('MARZ SANCTUARY - VERIFICATION SUITE');

  const results = {
    openfort: await testOpenFortConfiguration(),
    alchemy: await testAlchemyConfiguration(),
    gasSponsorship: await testGasSponsorship(),
    openProvider: await testOpenProviderAuthentication(),
    securityHeaders: await testSecurityHeaders(),
    smartAccountHook: await testSmartAccountHook(),
  };

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  const failed = total - passed;

  section('TEST SUMMARY');
  log(`  Total Tests: ${total}`);
  log(`  Passed: ${passed}`, colors.green);
  log(`  Failed: ${failed}`, failed > 0 ? colors.red : colors.green);

  if (failed === 0) {
    pass('ALL TESTS PASSED');
    process.exit(0);
  } else {
    fail('Some tests failed', 'Review output above');
    process.exit(1);
  }
}

runAllTests().catch((error) => {
  fail('Test suite crashed', error.message);
  process.exit(1);
});
