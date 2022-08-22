import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

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
    hardhat: {
      gas: 3000000000,
      blockGasLimit: 100000000429720,
      gasPrice: 875000000
    },
    neonlabs: {
      url: 'http://localhost:9090/solana',
      accounts: ['0x41167312f8c46439b2bcc5e5a6af929262efcd20357a56ebcbc455d835d9f080', 
      '0x41167312f8c46439b2bcc5e5a6af929262efcd20357a56ebcbc455d835d9f081', '0x41167312f8c46439b2bcc5e5a6af929262efcd20357a56ebcbc455d835d9f082', 
      '0x41167312f8c46439b2bcc5e5a6af929262efcd20357a56ebcbc455d835d9f083', '0x41167312f8c46439b2bcc5e5a6af929262efcd20357a56ebcbc455d835d9f084'],
      // @ts-ignore
      network_id: 111,
      chainId: 111,
      allowUnlimitedContractSize: false,
      timeout: 100000000,
      // @ts-ignore
      isFork: true
    }
  },
};

export default config;
