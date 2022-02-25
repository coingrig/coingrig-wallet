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
};

class bankStore {
  bankAccounts: IBankAccount[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'BankStore',
      properties: ['bankAccounts'],
      storage: AsyncStorage,
    });
  }

  async hydrateStore() {
    await hydrateStore(this);
  }

  get isHydrated() {
    return isHydrated(this);
  }

  updateAccount = action((id: string, data: IBankAccount) => {
    let pos = this.getAccountPosition(id);
    if (pos !== -1) {
      this.bankAccounts[pos] = data;
    }
    this.bankAccounts = this.bankAccounts.splice(0);
  });

  addAccount = action((bankAccount: IBankAccount) => {
    this.bankAccounts.push(bankAccount);
    return true;
  });

  getAccountById = (id: string) => {
    return this.bankAccounts.find((o: IBankAccount) => {
      return o.id === id;
    });
  };

  deleteAccountById = action((id: string) => {
    let index = this.getAccountPosition(id);
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
