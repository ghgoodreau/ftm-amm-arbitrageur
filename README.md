## All Credit to https://github.com/paco0x

This is merely a port of his work to test on FTM - Fantom Network

https://github.com/paco0x/amm-arbitrageur

## Edit Bot Config

Make sure to put FantomScan API Key in `/bot/config.ts`


## Deploy the contract
1. Edit network config in `hardhat.config.ts`

2. Copy the secret sample config：

```bash
$ cp .secret.ts.sample .secret.ts
```

3. Edit the private and address field in above config.


4. Then run the script to deploy. By default, it deploys to BSC. If you wanna dpeloy to other network, you may need to change the network settings in `hardhat.config.ts`. You also need to change the WETH or other token address in the `deploy.ts`


```bash
$ hardhart --network ftm run scripts/deploy.ts

```

## Bot implementation

The contract has a function `getProfit(address pool1, address pool2)`, which can be used to calculate the maximum profit between two pairs(denominated in base token).

The bot need to call `getProfit()` to get the possible profit between token pairs. Once it is profitable, bot calls `flashArbitrage(pool1, pool2)` to do the arbitrage. The profit will leaves in the contract address.

Contract owner can call `withdraw()` to withdraw the profit.

There already implemented a bot in typescript, to run it:

```bash
$ yarn run bot
```

## Available AMMs on FTM (Using this) 

- [SpiritSwap](https://spiritswap.finance/)
- [SpookySwap](https://spookyswap.finance/)
- [HyperJump](https://hyperjump.fi/)
- [~~SushiSwap~~](https://app.sushiswap.com/)(Not supported)

## Run UT

```bash
$ hardhat test
```
