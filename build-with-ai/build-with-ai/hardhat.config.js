import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import "dotenv/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],
  solidity: "0.8.20",
  networks: {
    polygon: {
      type: "http",
      url: process.env.POLYGON_RPC_URL || "https://polygon.drpc.org",
      chainId: 137,
      accounts: {
        type: "hd",
        mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk"
      },
      blockExplorers: {
        etherscan: {
          apiKey: process.env.POLYGONSCAN_API_KEY
        }
      }
    }
  }
});
