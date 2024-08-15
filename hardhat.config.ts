import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "zksync",
  networks: {
    hardhat: {
    },
    zksync: {
      url: "http://127.0.0.1:8011",
      timeout: 1000000000000000
    }
  },
};

export default config;
