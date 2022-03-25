import {Logs} from 'services/logs';
import {
  StorageDeleteItem,
  StorageGetItem,
  StorageSetItem,
} from 'services/storage';
import {CexStore} from 'stores/cexStore';
import {MarketStore} from 'stores/market';
import fx from 'services/fx';
var axios = require('axios');
const coins = require('../../assets/tokens.json');

var ccxt = require('ccxt');

class CexService {
  cex: any;
  exchanges: string[];
  cb: any;
  bin: any;
  constructor() {
    this.cex = {
      binance: null,
      ftx: null,
      coinbase: null,
    };
    this.exchanges = ccxt.exchanges;
    this.cb = null;
    this.bin = null;
    this.start();
    // this.getMarketData();
  }

  async getMarketData(cexID) {
    try {
      Logs.info('-----start-----');
      const url = 'https://assets.coingrig.com/data/' + cexID + '.json';
      const config = {
        method: 'get',
        url: url,
        headers: {
          // ApiKey: CONFIG.COINGRIG_KEY,
        },
      };
      const response = await axios(config);
      // console.log(Object.keys(response.data).length);
      Logs.info('-----end-----');
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async start() {
    try {
      if (!CexStore.isHydrated) {
        await CexStore.hydrateStore();
      }
    } catch (e) {
      Logs.error(e);
    }
    // this.cb = await this.getMarketData('coinbase');
    // this.bin = await this.getMarketData('binance');
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
    const b = await this.cex[cexID].fetchBalance();
    const balance: any = [];
    for (const [key, v] of Object.entries(b.total)) {
      if (v > 0) {
        const coin = coins.filter(
          item => item.symbol.toLowerCase() === key.toLowerCase(),
        );
        console.log(coin[0]);
        if (coin.length === 0) {
          if (key.toLowerCase() === 'usd' || key.toLowerCase() === 'usdt') {
            balance.push({
              id: null,
              symbol: key,
              balance: v,
              price: 1,
              totalValue: v,
              image: null,
            });
          } else if (key.toLowerCase() === 'eur') {
            balance.push({
              id: null,
              symbol: key,
              balance: v,
              price: fx.rates.EUR,
              totalValue: v / fx.rates.EUR,
              image: null,
            });
          } else {
            continue;
          }
        } else {
          balance.push({
            id: coin[0].id || null,
            symbol: key,
            balance: v,
            price: null,
            totalValue: null,
            image: coin[0].thumb || null,
          });
        }
      }
    }
    const map = balance.map(o => {
      return o.id;
    });
    const prices = await MarketStore.getCoinsByList(map);
    balance.forEach(b => {
      if (b.id && prices[b.id]) {
        b.price = prices[b.id].usd;
        b.totalValue = b.balance * prices[b.id].usd;
      }
    });

    Logs.info(cexID, balance);
    CexStore.addCexData(cexID, balance);
    Logs.error('END --- ', cexID);
    return balance;
  }

  async getAllBalances() {
    try {
      const cexList = CexStore.cexs;
      if (cexList.length > 0) {
        for (let index = 0; index < cexList.length; index++) {
          const item = cexList[index];
          await this.getBalance(item.id);
        }
        Logs.info('Total CEX balance', CexStore.sumTotalBalance());
        CexStore.updateTotalBalance(CexStore.sumTotalBalance());
      } else {
        CexStore.updateTotalBalance(0);
      }
    } catch (error) {
      throw error;
    }
  }

  async connect(cexID) {
    Logs.error('Connect to --- ', cexID);
    // const exchangeId = 'ftx';
    const exchangeClass = ccxt[cexID];
    const [apiKey, secret]: any = await this.getCexKeys(cexID);
    if (apiKey && secret) {
      this.cex[cexID] = new exchangeClass({
        apiKey: apiKey,
        secret: secret,
        markets: [],
      });
      // this.cex[cexID].markets = await this.getMarketData(cexID);
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

  async saveCexKeys(cexID, apiKey, secret, title, logo) {
    const newCex = CexStore.addCex(cexID, title, logo);
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
