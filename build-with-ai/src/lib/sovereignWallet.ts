import { createPublicClient, createWalletClient, http, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import Safe from "@safe-global/protocol-kit";
import { ethers } from "ethers";
// Polygon RPC (Alchemy or public)
const RPC_URL =
  process.env.ALCHEMY_API_KEY
    ? `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    : "https://polygon-rpc.com";
// -----------------------------------------------------------------------------
// 1. Local Device Signer (Sovereign Key)
// -----------------------------------------------------------------------------

export function getLocalPrivateKey(): string {
  if (typeof window === "undefined") {
    throw new Error("Local signer only available in browser");
  }

  let key = localStorage.getItem("sovereign_private_key");
  if (!key) {
    const random = crypto.getRandomValues(new Uint8Array(32));
    key = `0x${Array.from(random)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")}`;
    localStorage.setItem("sovereign_private_key", key);
  }

  return key;
}

export function getLocalSigner() {
  const key = getLocalPrivateKey();
  return privateKeyToAccount(key as Hex);
}

// -----------------------------------------------------------------------------
// 2. viem RPC Clients
// -----------------------------------------------------------------------------

export const publicClient = createPublicClient({
  transport: http(RPC_URL),
});

export function getWalletClient() {
  const account = getLocalSigner();
  return createWalletClient({
    account,
    transport: http(RPC_URL),
  });
}

// -----------------------------------------------------------------------------
// 3. Safe Smart Account Initialization
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// 4. Execute a Safe Transaction
// -----------------------------------------------------------------------------


// FIXED Safe initialization for protocol-kit v7.1.0
// (replaces the old Safe.create block)


// FIX: Replace ethers provider with EIP-1193 provider for Safe v7
// (Safe.init requires an EIP-1193 provider, not ethers.JsonRpcProvider)

function makeEip1193Provider(rpcUrl: string) {
  return {
    request: async ({ method, params }: { method: string; params?: any }) => {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method,
          params: params || [],
        }),
      });

      const json = await response.json();
      if (json.error) throw new Error(json.error.message);
      return json.result;
    },
  };
}

// FIX: Split providers for ethers signer and Safe v7

export async function createSafeAccount() {
  const privateKey = getLocalPrivateKey();
  const account = privateKeyToAccount(privateKey as Hex);

  // ethers provider (required for signer)
  const ethersProvider = new ethers.JsonRpcProvider(RPC_URL);

  // EIP-1193 provider (required for Safe.init)
  const safeProvider = makeEip1193Provider(RPC_URL);

  

  const safe = await Safe.init({
    provider: safeProvider,
    signer: privateKey,
    safeAddress: account.address,
  });

  return {
    safe,
    signer: privateKey,
    address: await safe.getAddress(),
    account,
  };
}

// 4. Execute a Safe Transaction (exported for smart-account-bridge)

export async function executeSafeTransaction(
  to: `0x${string}`,
  data: Hex,
  value: bigint = 0n
): Promise<string> {
  const { safe } = await createSafeAccount();

  const safeTx = await safe.createTransaction({
    transactions: [
      {
        to,
        data,
        value: value.toString(),
      },
    ],
  });

  const signed = await safe.signTransaction(safeTx);
  const result = await safe.executeTransaction(signed);

  return result.hash;
}
