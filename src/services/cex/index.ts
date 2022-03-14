import {Logs} from 'services/logs';
import {
  StorageDeleteItem,
  StorageGetItem,
  StorageSetItem,
} from 'services/storage';
import {CexStore} from 'stores/cexStore';

var ccxt = require('ccxt');

class CexService {
  cex: any;
  exchanges: string[];
  constructor() {
    this.cex = {
      binance: null,
      ftx: null,
      coinbase: null,
    };
    this.exchanges = ccxt.exchanges;
    this.start();
  }

  async start() {
    try {
      if (!CexStore.isHydrated) {
        await CexStore.hydrateStore();
      }
    } catch (e) {
      Logs.error(e);
    }
  }

  async getBalance(cexID) {
    // if (cexID === 'coinbase') {
    //   return;
    // }
    if (!this.cex[cexID]) {
      await this.connect(cexID);
    } else {
      Logs.info(cexID, 'Connected');
    }
    // let markets = await this.cex[cexID].load_markets();
    // console.log(
    //   cexID,
    //   Object.keys(markets).filter(o => o.startsWith('BTC')),
    // );

    // console.log(markets['BAT/USD']);
    const b = await this.cex[cexID].fetchBalance();
    // let json = JSON.stringify(this.cex[cexID].markets);
    // console.log('json', json.length);
    // console.log('json', json);
    const balance: any = [];
    // // console.log(cexID, b.total);
    // // console.log(cexID, b);

    // // const b = await this.cex[cexID].fetchTickers();
    // // console.log(cexID, b);
    let tickers = [];
    for (const [key, v] of Object.entries(b.total)) {
      if (v > 0) {
        if (cexID === 'coinbase') {
          if (key === 'USD') {
            continue;
          }
          tickers.push(key + '/USD');
        } else {
          if (key === 'USDT') {
            continue;
          }
          tickers.push(key + '/USDT');
        }
      }
    }
    const priceTickers = await this.cex[cexID].fetchTickers(tickers);
    // console.log(priceTickers);
    for (const [key, v] of Object.entries(b.total)) {
      if (v > 0) {
        if (cexID === 'coinbase') {
          if (key === 'USD') {
            continue;
          }
          let price = priceTickers[key + '/USD'];
          balance.push({
            symbol: key.split('/')[0],
            balance: v,
            price: price.info,
            totalValue: price.info * v,
          });
        } else {
          if (key === 'USDT') {
            continue;
          }
          let price = priceTickers[key + '/USDT'];
          balance.push({
            symbol: key.split('/')[0],
            balance: v,
            price: price.ask,
            totalValue: price.ask * v,
          });
        }
      }
    }
    // for (let i = 0; i < ask.length; i++) {
    //   const value = ask[i];

    // }

    // let value = 0;
    // try {
    //   const {ask} = await this.cex[cexID].fetchTicker(key + '/USDT');
    //   value = ask;
    // } catch (e) {
    //   const {ask} = await this.cex[cexID].fetchTicker(key + '/USD');
    //   value = ask;
    // }
    //
    // balance.push({
    //   symbol: key,
    //   balance: v,
    //   price: value,
    //   totalValue: value * v,
    // });
    Logs.info(cexID, balance);
    CexStore.addCexData(cexID, balance);
    return balance;
  }

  async getAllBalances() {
    try {
      const cexList = CexStore.cexs;
      if (cexList.length > 0) {
        for (let index = 0; index < cexList.length; index++) {
          const item = cexList[index];
          this.getBalance(item.id);
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
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
      return null;
    }
  }

  async saveCexKeys(cexID, apiKey, secret, title) {
    const newCex = CexStore.addCex(cexID, title);
    if (newCex) {
      let data: any = {apiKey, secret};
      data = JSON.stringify(data);
      const save = await StorageSetItem('@CEX_' + cexID, data, true);
      if (save) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  async deleteCex(cexID) {
    CexStore.deleteCexById(cexID);
    await StorageDeleteItem('@CEX_' + cexID, true);
    this.cex[cexID] = null;
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
