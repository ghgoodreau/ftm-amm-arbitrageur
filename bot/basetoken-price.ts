import axios from 'axios';
import AsyncLock from 'async-lock';

import config from './config';
import log from './log';

const lock = new AsyncLock();

let ftmPrice = 0;

// clear bnb price every hour
setInterval(() => {
  lock
    .acquire('ftm-price', () => {
      ftmPrice = 0;
      return;
    })
    .then(() => {});
}, 3600000);

export async function getFtmPrice(): Promise<number> {
  return await lock.acquire('ftm-price', async () => {
    if (ftmPrice !== 0) {
      return ftmPrice;
    }
    const res = await axios.get(config.ftmScanUrl);
    ftmPrice = parseFloat(res.data.result.ethusd);
    log.info(`FTM price: $${ftmPrice}`);
    return ftmPrice;
  });
}
