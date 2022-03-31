import {action, makeAutoObservable} from 'mobx';
import {hydrateStore, isHydrated, makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type IBankAccount = {
  id: string;
  iban: string | null;
  currency: string | null;
  name: string | null;
  product: string | null;
  amount: number | null;
  balanceType: string;
  bankName: string | null;
  bankLogo: string | null;
  ownerName: string | null;
  bankID: string | null;
  expire: string | null;
  offset: number | null;
};

class bankStore {
  bankAccounts: IBankAccount[] = [];
  totalBalance: number = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'BankStore',
      properties: ['bankAccounts', 'totalBalance'],
      storage: AsyncStorage,
    });
  }

  async hydrateStore() {
    await hydrateStore(this);
  }

  get isHydrated() {
    return isHydrated(this);
  }

  updateTotalBalance = action((balance: number) => {
    this.totalBalance = balance;
  });

  updateAccount = action((id: string, data: IBankAccount) => {
    const pos = this.getAccountPosition(id);
    if (pos !== -1) {
      this.bankAccounts[pos] = data;
    }
    this.bankAccounts = this.bankAccounts.slice(0);
  });

  updateAccountOffset = action((id: string, _offset: number) => {
    const pos = this.getAccountPosition(id);
    if (pos !== -1) {
      this.bankAccounts[pos].offset = _offset;
    }
    this.bankAccounts = this.bankAccounts.slice(0);
  });

  addAccount = action((bankAccount: IBankAccount) => {
    this.bankAccounts.push(bankAccount);
    this.bankAccounts = this.bankAccounts.slice(0);
    return true;
  });

  getAccountById = (id: string) => {
    return this.bankAccounts.find((o: IBankAccount) => {
      return o.id === id;
    });
  };

  deleteAccountById = action((id: string) => {
    const index = this.getAccountPosition(id);
    if (index !== -1) {
      this.bankAccounts.splice(index, 1);
      this.bankAccounts = this.bankAccounts.slice(0);
    }
    return index !== -1;
  });

  private getAccountPosition = (id: string) => {
    return this.bankAccounts.findIndex(o => {
      return o.id === id;
    });
  };
}

export const BankStore: bankStore = new bankStore();
