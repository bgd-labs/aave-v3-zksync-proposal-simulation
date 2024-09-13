import hre from 'hardhat';
import {ethers} from 'hardhat';
import {AaveV3ZkSync, GovernanceV3ZkSync} from '@bgd-labs/aave-address-book';

async function main() {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [GovernanceV3ZkSync.EXECUTOR_LVL_1],
    });
    const signer = await ethers.getSigner(GovernanceV3ZkSync.EXECUTOR_LVL_1);

    // deployed zksync activation proposal address
    const payloadAddress = "0xab4Ca2EEb42EB72c7a07C62783544ACec2EAbc0e";

    const tokenAddresses = {
      usdc: "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4",
      usdt: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
      weth: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
      wstEth: "0x703b52F2b28fEbcB60E1372858AF5b18849FE867",
      zk: "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
    };

    // We transfer tokens from the executor to the payload as the payload needs to hold token balances to seed tokens to the pool
    // after listing and as the payload is not being executed via delegate-call
    for (const [tokenName, address] of Object.entries(tokenAddresses)) {
      const token = await ethers.getContractAt("IERC20", address, signer);
      const amount = tokenName === 'usdc' || tokenName === 'usdt' ? 100e6 :
                      tokenName === 'weth' || tokenName === 'wstEth' ? 0.1e18 :
                      1000e18; // for zk
      await token.transfer(payloadAddress, amount.toString());
    }

    // We give pool admin role to the payload so the activation payload can list the assets
    // In addition we also set the role admin so the activation payload having pool admin role can also
    // give pool admin role to the guardian when executing the proposal
    const acl = await ethers.getContractAt("IACLManager", AaveV3ZkSync.ACL_MANAGER, signer);
    await acl.addPoolAdmin(payloadAddress);
    const POOL_ADMIN_ROLE = "0x12ad05bde78c5ab75238ce885307f96ecd482bb402ef831f99e7018a0f169b7b";
    await acl.setRoleAdmin(POOL_ADMIN_ROLE, POOL_ADMIN_ROLE);

    // We transfer the ownership of emission manager to the payload as the payload sets emission admin and 
    // the payload needs to be the owner in order to do so
    const ownable = await ethers.getContractAt("IOwnable", AaveV3ZkSync.EMISSION_MANAGER, signer);
    await ownable.transferOwnership(payloadAddress);

    // Execute payload
    const executor = await ethers.getContractAt("IProposalGenericExecutor", payloadAddress, signer);
    await executor.execute();
}

main();