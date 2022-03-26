import {action, makeAutoObservable} from 'mobx';
import {hydrateStore, isHydrated, makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fx from 'services/fx';

export type IFiatAccounts = {
  id: string;
  name: string;
  balance: number;
  currency: string;
  usdBalance: number;
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
      (total, acc) => total + acc.usdBalance,
      0.0,
    );
  }

  updateTotalBalance = action((balance: number) => {
    this.totalBalance = balance;
  });

  updateAccount = action((id: string, data: IFiatAccounts) => {
    let pos = this.getAccountPosition(id);
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
    let index = this.getAccountPosition(id);
    if (index !== -1) {
      this.fiatAccounts.splice(index, 1);
      this.fiatAccounts = this.fiatAccounts.slice(0);
    }
    return index !== -1;
  });

  updateAllBalances = action(() => {
    if (Object.entries(fx.rates).length > 0) {
      let _totalBalance = 0;
      this.fiatAccounts.forEach(item => {
        item.usdBalance = item.balance / fx.rates[item.currency];
        _totalBalance = _totalBalance + item.usdBalance;
      });
      this.fiatAccounts = this.fiatAccounts.slice(0);
      this.updateTotalBalance(_totalBalance);
    }
  });

  private getAccountPosition = (id: string) => {
    return this.fiatAccounts.findIndex(o => {
      return o.id === id;
    });
  };
}

export const FiatStore: fiatStore = new fiatStore();
