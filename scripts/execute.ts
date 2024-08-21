import hre from 'hardhat';
import {ethers} from 'hardhat';
import {AaveV3ZkSync, GovernanceV3ZkSync} from '@bgd-labs/aave-address-book';

async function main() {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [GovernanceV3ZkSync.EXECUTOR_LVL_1],
    });
    const signer = await ethers.getSigner(GovernanceV3ZkSync.EXECUTOR_LVL_1);

    const poolConfigurator = await ethers.getContractAt("IPoolConfigurator", AaveV3ZkSync.POOL_CONFIGURATOR, signer);
    await poolConfigurator.setPoolPause(false);
}

main();