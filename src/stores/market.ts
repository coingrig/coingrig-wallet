import {action, makeAutoObservable, runInAction} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllCoins, getCoins} from '@coingrig/core';

export type MarketCapCoinType = {
  id: string;
  symbol: string;
  name: string;
  price_change_percentage_24h: number;
  current_price: number;
  image: string;
};

class marketStore {
  coins: MarketCapCoinType[] = [];
  markets: {} = {};

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'MarketStore',
      properties: ['coins', 'markets'],
      storage: AsyncStorage,
    });
  }

  setMarkets = action(marketsData => {
    this.markets = marketsData;
  });

  getCoinsByList = async (list: string[]) => {
    return getCoins(list);
  };

  getTopCoins = async (limit: number) => {
    const newCoins = await getAllCoins(limit, true);
    if (!newCoins) {
      return false;
    }
    runInAction(() => {
      this.coins = newCoins;
    });
    return this.coins;
  };
}

export const MarketStore: marketStore = new marketStore();
