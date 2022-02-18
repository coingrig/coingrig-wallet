import CONFIG from 'config';
import {Logs} from 'services/logs';
import {StorageGetItem, StorageSetItem} from 'services/storage';

var ccxt = require('ccxt');

class CexService {
  cex: any;
  exchanges: string[];
  constructor() {
    this.cex = {
      binance: null,
      ftx: null,
    };
    this.exchanges = ccxt.exchanges;
  }

  async getBalance(cexID) {
    if (!this.cex[cexID]) {
      await this.connect(cexID);
    }
    const b = await this.cex[cexID].fetchBalance();
    const balance: any = [];
    console.log(b.total);
    for (const [key, v] of Object.entries(b.total)) {
      if (v > 0) {
        const {ask} = await this.cex[cexID].fetchTicker(key + '/USDT');
        balance.push({
          symbol: key,
          balance: v,
          price: ask,
          totalValue: ask * v,
        });
      }
    }
    return balance;
  }

  async connect(cexID) {
    Logs.info('Connect to ', cexID);
    // const exchangeId = 'ftx';
    const exchangeClass = ccxt[cexID];
    const [apiKey, secret]: any = await this.getCexKeys(cexID);
    if (apiKey && secret) {
      this.cex[cexID] = new exchangeClass({
        apiKey: apiKey,
        secret: secret,
      });
    }
  }

  async getCexKeys(cexID: string) {
    let keys: any = await StorageGetItem('@CEX_' + cexID, true);
    if (keys) {
      keys = JSON.parse(keys);
      return [keys.apiKey, keys.secret];
    } else {
      return [CONFIG.COINBASE.apiKey, CONFIG.COINBASE.secret];
      //return null;
    }
  }

  async saveCexKeys(cexID, apiKey, secret) {
    let data: any = {apiKey, secret};
    data = JSON.stringify(data);
    const save = await StorageSetItem('@CEX_' + cexID, data, true);
    if (save) {
      return true;
    } else {
      return false;
    }
  }
}

export default new CexService();

// exchange.verbose = true;
// const b = await exchange.fetchBalance();
// // console.log(b);
// for (const [key, v] of Object.entries(b.total)) {
//   if (v > 0) {
//     console.log(`${key}: ${v}`);
//     // console.log('--', await exchange.fetchTicker(key + '/USDT'));
//   }
// }
// console.log('--', await exchange.fetchTickers(['BTC/USDT', 'ICP/USDT']));
// console.log(exchange.currency('BTC'));
// console.log(await exchange.fetchDepositAddress('BTC'));
// console.log('--', await exchange.fetchTicker('BTC/USDT'));
// let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// if (exchange.has.fetchOHLCV) {
//   for (exchange.symbol in exchange.markets) {
//     await sleep(exchange.rateLimit); // milliseconds
//     console.log(await exchange.fetchOHLCV(exchange.symbol, '1m')); // one minute
//   }
// }
// return;
