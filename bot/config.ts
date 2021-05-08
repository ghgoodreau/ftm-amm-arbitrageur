import { BigNumber, BigNumberish, utils } from 'ethers';

interface Config {
  contractAddr: string;
  logLevel: string;
  minimumProfit: number;
  gasPrice: BigNumber;
  gasLimit: BigNumberish;
  ftmScanUrl: string;
  concurrency: number;
}

const contractAddr = '0xXXXXXXXXXXXXXXXXXXXXXX'; // flash bot contract address
const gasPrice = utils.parseUnits('10', 'gwei');
const gasLimit = 300000;

const ftmScanApiKey = 'XXXXXXXXXXXXXXXX'; // bscscan API key
const ftmScanUrl = `https://api.ftmscan.com/api?module=stats&action=ftmprice&apikey=${ftmScanApiKey}`;

const config: Config = {
  contractAddr: contractAddr,
  logLevel: 'info',
  concurrency: 50,
  minimumProfit: 50, // in USD
  gasPrice: gasPrice,
  gasLimit: gasLimit,
  ftmScanUrl: ftmScanUrl,
};

export default config;
