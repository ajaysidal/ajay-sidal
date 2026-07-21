import { polygon } from 'wagmi/chains';

/**
 * Polygon Mainnet Configuration
 * Production-ready with load-balanced public RPCs
 */
export const polygonMainnet = polygon;

/**
 * Fallback RPC URLs for redundancy
 * Primary: https://polygon-rpc.com (public load balancer)
 * Secondary: https://rpc-mainnet.maticvigil.com
 */
export const POLYGON_RPC_PRIMARY = 'https://polygon-rpc.com';
export const POLYGON_RPC_FALLBACK = 'https://rpc-mainnet.maticvigil.com';

export const POLYGON_CHAIN_ID = 137;

/**
 * Polygon network metadata for UI display
 */
export const polygonNetworkInfo = {
  name: 'Polygon Network',
  displayName: 'Sovereign Network (Polygon)',
  nativeCurrency: polygon.nativeCurrency,
  blockExplorer: polygon.blockExplorers?.default.url || 'https://polygonscan.com',
};
