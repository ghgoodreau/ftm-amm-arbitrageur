import { ethers, run } from 'hardhat';

import deployer from '../.secret';

// WBNB address on BSC, WETH address on ETH
const WethAddr = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83';

async function main() {
  await run('compile');
  const FlashBot = await ethers.getContractFactory('FlashBot');
  const flashBot = await FlashBot.deploy(WethAddr);

  console.log(`FlashBot deployed to ${flashBot.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
