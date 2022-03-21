import {action, makeAutoObservable} from 'mobx';
import {hydrateStore, isHydrated, makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';

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
      properties: ['cexs'],
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
    return this.cexs.reduce(
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
    );
  }

  updateTotalBalance = action((balance: number) => {
    this.totalBalance = balance;
  });

  addCex = action((id, title, logo) => {
    const data = null;
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
    let pos = this._getCexPosition(id);
    if (pos !== -1) {
      this.cexs[pos].data = data;
    }
    this.cexs = this.cexs.splice(0);
  });

  deleteCexById = action((id: string) => {
    let index = this._getCexPosition(id);
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
