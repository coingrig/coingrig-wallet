import {action, runInAction, makeAutoObservable} from 'mobx';
import {hydrateStore, isHydrated, makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FxStore} from './fxStore';

export type IFiatAccounts = {
  id: string;
  name: string;
  balance: number;
  currency: string;
  usdBalance: number | undefined;
};

class fiatStore {
  fiatAccounts: IFiatAccounts[] = [];
  totalBalance: number = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'FiatStore',
      properties: ['fiatAccounts', 'totalBalance'],
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
    return this.fiatAccounts.reduce(
      (total, acc) => total + (acc.usdBalance ?? 0),
      0.0,
    );
  }

  updateTotalBalance = action((balance: number) => {
    this.totalBalance = balance;
  });

  updateAccount = action((id: string, data: IFiatAccounts) => {
    const pos = this.getAccountPosition(id);
    if (pos !== -1) {
      this.fiatAccounts[pos] = data;
    }
    this.fiatAccounts = this.fiatAccounts.slice(0);
  });

  addAccount = action((bankAccount: IFiatAccounts) => {
    this.fiatAccounts.push(bankAccount);
    return true;
  });

  getAccountById = (id: string) => {
    return this.fiatAccounts.find((o: IFiatAccounts) => {
      return o.id === id;
    });
  };

  deleteAccountById = action((id: string) => {
    const index = this.getAccountPosition(id);
    if (index !== -1) {
      this.fiatAccounts.splice(index, 1);
      this.fiatAccounts = this.fiatAccounts.slice(0);
    }
    return index !== -1;
  });

  updateAllBalances = action(() => {
    const updateAction = () => {
      runInAction(() => {
        let _totalBalance = 0;
        for (let i = 0; i < this.fiatAccounts.length; i++) {
          const item = this.fiatAccounts[i];
          item.usdBalance = FxStore.toUsd(item.balance, item.currency);
          if (item.usdBalance !== undefined) {
            _totalBalance = _totalBalance + item.usdBalance;
          }
        }
        this.fiatAccounts = this.fiatAccounts.slice(0);
        this.updateTotalBalance(_totalBalance);
      });
    };
    if (FxStore.isHydrated) {
      updateAction();
    } else {
      FxStore.hydrateStore().then(updateAction);
    }
  });

  private getAccountPosition = (id: string) => {
    return this.fiatAccounts.findIndex(o => {
      return o.id === id;
    });
  };
}

export const FiatStore: fiatStore = new fiatStore();
