import { defineChain } from 'viem';

/**
 * MARZ Network Configuration
 * The sovereign blockchain network for BUILDWITHAI
 */
export const marzChain = defineChain({
  id: 12345,
  name: 'MARZ Network',
  nativeCurrency: {
    name: 'MARZ',
    symbol: 'MARZ',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.marz.network'],
    },
    public: {
      http: ['https://rpc.marz.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MARZ Explorer',
      url: 'https://explorer.marz.network',
    },
  },
  testnet: false,
});

export const MARZ_CHAIN_ID = 12345;
