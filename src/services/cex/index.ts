import {Logs} from 'services/logs';
import {
  StorageDeleteItem,
  StorageGetItem,
  StorageSetItem,
} from 'services/storage';
import {CexStore} from 'stores/cexStore';
import {MarketStore} from 'stores/market';
import {FxStore} from 'stores/fxStore';
import CONFIG from 'config';
import ccxt from 'ccxt';
import {showMessage} from 'react-native-flash-message';
import i18n from 'i18n';
const coins = require('../../assets/tokens.json');

class CexService {
  cex: any;
  // exchanges: string[];
  lastFetch: number = 0;
  constructor() {
    this.cex = {
      binance: null,
      ftx: null,
      coinbase: null,
      gateio: null,
      cryptocom: null,
    };
    // this.exchanges = ccxt.exchanges;
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
    try {
      if (!this.cex[cexID]) {
        await this.connect(cexID);
      } else {
        Logs.info(cexID, 'Connected');
      }
      const b = await this.cex[cexID].fetchBalance();
      const balance: any = [];
      if (!FxStore.isHydrated) {
        await FxStore.hydrateStore();
      }
      for (const [key, v] of Object.entries(b.total)) {
        if (v > 0) {
          const coin = coins.filter(
            item => item.symbol.toLowerCase() === key.toLowerCase(),
          );
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
            } else if (FxStore.getRate(key) !== undefined) {
              balance.push({
                id: null,
                symbol: key,
                balance: v,
                price: FxStore.getRate(key) ?? 0,
                totalValue: FxStore.toUsd(v, key) ?? 0,
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
      return balance;
    } catch (error: any) {
      let errorMessage = null;
      if (error === '[Error: Network Error]') {
        throw error;
      }
      // Keep all other errors silent
      switch (cexID) {
        case 'binance':
          if (
            error.message.indexOf('-2015') !== -1 ||
            error.message.indexOf('Invalid API-key') !== -1
          ) {
            errorMessage = i18n.t('Cannot authenticate Binance');
          }
          break;
        case 'ftx':
          if (error.message.indexOf('Invalid API key') !== -1) {
            errorMessage = i18n.t('Cannot authenticate FTX');
          }
          break;
        case 'coinbase':
          if (error.message.indexOf('authentication_error') !== -1) {
            errorMessage = i18n.t('Cannot authenticate Coinbase');
          }
          break;
        case 'gateio':
          if (error.message.indexOf('INVALID_KEY') !== -1) {
            errorMessage = i18n.t('Cannot authenticate Gate.io');
          }
          break;
        case 'cryptocom':
          if (
            error.message.indexOf('10002') !== -1 ||
            error.message.indexOf('10007') !== -1
          ) {
            errorMessage = i18n.t('Cannot authenticate Crypto.com');
          }
          break;
      }
      if (errorMessage) {
        showMessage({
          message: i18n.t(errorMessage),
          type: 'danger',
        });
        throw 'Authorization error';
      }
      throw error;
    }
  }

  async getAllBalances() {
    const cexList = CexStore.cexs;
    if (cexList.length > 0) {
      const now = Date.now();
      if (now - this.lastFetch! < CONFIG.BALANCE_TIMEOUT * 1000) {
        return;
      }
      this.lastFetch = now;
      try {
        for (let index = 0; index < cexList.length; index++) {
          try {
            const item = cexList[index];
            await this.getBalance(item.id);
          } catch (error) {
            Logs.error(error);
          }
        }
        Logs.info('Total CEX balance', CexStore.sumTotalBalance());
        CexStore.updateTotalBalance(CexStore.sumTotalBalance());
      } catch (error) {
        Logs.error(error);
      }
    } else {
      CexStore.updateTotalBalance(0);
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
