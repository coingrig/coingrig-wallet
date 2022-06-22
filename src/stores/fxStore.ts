import {action, makeAutoObservable} from 'mobx';
import {hydrateStore, isHydrated, makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Logs} from 'services/logs';

class fxStore {
  rates: any = {};

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'FxStore',
      properties: ['rates'],
      storage: AsyncStorage,
    });
  }

  async hydrateStore() {
    await hydrateStore(this);
  }

  get isHydrated() {
    return isHydrated(this);
  }

  setRates = action((rates: any) => {
    Logs.info('Call Set FX Rates');
    // if (JSON.stringify(this.rates) === JSON.stringify(rates)) {
    //   Logs.info('Same FX Rates');
    // }
    this.rates = rates;
  });

  getRate = (currency: string) => {
    return this.rates[currency.toUpperCase()];
  };

  toUsd = (amount: any, currency: string) => {
    const rate = this.rates[currency.toUpperCase()];
    if (!rate) {
      return undefined;
    }
    return amount / rate;
  };
}

export const FxStore: fxStore = new fxStore();
