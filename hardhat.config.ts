import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const proxyUrl = process.env.NEON_PROXY_URL;
// @ts-ignore
const accounts = process.env.NEON_ACCOUNTS.split(",");
// @ts-ignore
const chainId = parseInt(process.env.NEON_CHAIN_ID) || 111;


const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.5.0"
      },
      {
        version: "0.5.16"
      },
      {
        version: "0.6.6"
      },
      {
        version: "0.6.12"
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
    },
  },
  defaultNetwork: 'neonlabs',
  networks: {
    neonlabs: {
      url: proxyUrl,
      // @ts-ignore
      accounts: accounts,
      // @ts-ignore
      chainId: chainId,
      allowUnlimitedContractSize: false,
      timeout: 100000000,
    }
  },
};

export default config;
