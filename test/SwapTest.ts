import { Contract } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { FlashBot } from '../typechain/FlashBot';
import { IWETH } from '../typechain/IWETH';

describe('Flashswap', () => {
  let weth: IWETH;
  let flashBot: FlashBot;

  const WFTM = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83';
  const USDC = '0x04068da6c83afcfa0e13ba15a6696662335d5b75';

  beforeEach(async () => {
    const wethFactory = (await ethers.getContractAt('IWETH', WFTM)) as IWETH;
    weth = wethFactory.attach(WFTM) as IWETH;

    const fbFactory = await ethers.getContractFactory('FlashBot');
    flashBot = (await fbFactory.deploy(WFTM)) as FlashBot;
  });

  describe('flash swap arbitrage', () => {
    let signer: SignerWithAddress;

    const uniFactoryAbi = ['function getPair(address, address) view returns (address pair)'];
    const uniPairAbi = ['function sync()'];

    const mdexFactoryAddr = '0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8';
    const mdexFactory = new ethers.Contract(mdexFactoryAddr, uniFactoryAbi, waffle.provider);
    let mdexPairAddr: any;
    let mdexPair: Contract;

    const pancakeFactoryAddr = '0xBCfCcbde45cE874adCB698cC183deBcF17952812';
    const pancakeFactory = new ethers.Contract(pancakeFactoryAddr, uniFactoryAbi, waffle.provider);
    let pancakePairAddr: any;

    before(async () => {
      [signer] = await ethers.getSigners();
      mdexPairAddr = await mdexFactory.getPair(WFTM, USDC);
      mdexPair = new ethers.Contract(mdexPairAddr, uniPairAbi, waffle.provider);
      pancakePairAddr = await pancakeFactory.getPair(WFTM, USDC);
    });

    it('do flash swap between Pancake and MDEX', async () => {
      // transfer 100000 to mdex pair
      const amountEth = ethers.utils.parseEther('100000');
      await weth.deposit({ value: amountEth });
      await weth.transfer(mdexPairAddr, amountEth);
      await mdexPair.connect(signer).sync();

      const balanceBefore = await ethers.provider.getBalance(flashBot.address);
      await flashBot.flashArbitrage(mdexPairAddr, pancakePairAddr);
      const balanceAfter = await ethers.provider.getBalance(flashBot.address);

      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it('calculate how much profit we get', async () => {
      // transfer 100000 to mdex pair
      const amountEth = ethers.utils.parseEther('100000');
      await weth.deposit({ value: amountEth });
      await weth.transfer(mdexPairAddr, amountEth);
      await mdexPair.connect(signer).sync();

      const res = await flashBot.getProfit(mdexPairAddr, pancakePairAddr);
      expect(res.profit).to.be.gt(ethers.utils.parseEther('500'));
      expect(res.baseToken).to.be.eq(WFTM);
    });

    it('revert if callback is called from address without permission', async () => {
      await expect(
        flashBot.uniswapV2Call(flashBot.address, ethers.utils.parseEther('1000'), 0, '0xabcd')
      ).to.be.revertedWith('Non permissioned address call');
    });
  });
});
