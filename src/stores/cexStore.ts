import {action, makeAutoObservable} from 'mobx';
import {hydrateStore, isHydrated, makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import {FxStore} from './fxStore';

export type CexStoreType = {
  id: string;
  title: string;
  data: any;
  logo: string;
};

class cexStore {
  cexs: CexStoreType[] = [];
  totalBalance: number = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'CexStore',
      properties: ['cexs', 'totalBalance'],
      storage: AsyncStorage,
    });
  }

  async hydrateStore() {
    await hydrateStore(this);
  }

  get isHydrated() {
    return isHydrated(this);
  }

  sumTotalBalance() {
    return this.cexs
      .reduce(
        (total, cex) =>
          new BigNumber(total).plus(
            new BigNumber(
              cex.data.reduce(
                (subtotal, asset) =>
                  new BigNumber(subtotal).plus(new BigNumber(asset.totalValue)),
                new BigNumber(0),
              ),
            ),
          ),
        new BigNumber(0),
      )
      .toNumber();
  }

  updateTotalBalance = action((balance: number) => {
    this.totalBalance = balance;
  });

  // Update fiat accounts from CEXs when the fiat exchange rate changes
  updateFiatAccounts = action(() => {
    for (let i = 0; i < this.cexs.length; i++) {
      const cex = this.cexs[i];
      for (let z = 0; z < cex.data.length; z++) {
        const coin = cex.data[z];
        // is not a coing, maybe it is a fiat account
        if (coin.id === null) {
          const rate = FxStore.getRate(coin.symbol);
          // if a rate matches then treat it as a fiat account
          if (rate !== undefined) {
            this.cexs[i].data[z].price = FxStore.getRate(coin.symbol) ?? 0;
            this.cexs[i].data[z].totalValue =
              FxStore.toUsd(coin.balance, coin.symbol) ?? 0;
          }
        }
      }
    }
    this.updateTotalBalance(this.sumTotalBalance());
    this.cexs = this.cexs.slice(0);
  });

  addCex = action((id, title, logo) => {
    const data = [];
    const check = this.getCexById(id);
    if (!check) {
      this.cexs.push({id, title, data, logo});
      return true;
    } else {
      return null;
    }
  });

  getCexById = (id: String) => {
    return this.cexs.find((o: CexStoreType) => {
      return o.id === id;
    });
  };

  addCexData = action((id, data) => {
    const pos = this._getCexPosition(id);
    if (pos !== -1) {
      this.cexs[pos].data = data;
    }
    this.cexs = this.cexs.slice(0);
  });

  deleteCexById = action((id: string) => {
    const index = this._getCexPosition(id);
    if (index !== -1) {
      this.cexs.splice(index, 1);
      this.cexs = this.cexs.slice(0);
    }
    return index !== -1;
  });

  _getCexPosition = (id: string) => {
    return this.cexs.findIndex(o => {
      return o.id === id;
    });
  };
}

export const CexStore: cexStore = new cexStore();
