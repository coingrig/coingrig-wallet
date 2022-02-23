import {action, makeAutoObservable} from 'mobx';
import {hydrateStore, isHydrated, makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type IBankAccount = {
  id: string;
  iban: string;
  currency: string;
  name: string;
  product: string;
  amount: string;
  balanceType: string;
  lastChangeDateTime: string;
  bankName: string | null;
  bankLogo: string | null;
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

  // addCex = action((id, title) => {
  //   const data = null;
  //   const check = this.getCexById(id);
  //   if (!check) {
  //     this.cexs.push({id, title, data});
  //     return true;
  //   } else {
  //     return null;
  //   }
  // });

  // getCexById = (id: String) => {
  //   return this.cexs.find((o: CexStoreType) => {
  //     return o.id === id;
  //   });
  // };

  // addCexData = action((id, data) => {
  //   let pos = this._getCexPosition(id);
  //   if (pos !== -1) {
  //     this.cexs[pos].data = data;
  //   }
  //   this.cexs = this.cexs.splice(0);
  // });

  // deleteCexById = action((id: string) => {
  //   let index = this._getCexPosition(id);
  //   if (index !== -1) {
  //     this.cexs.splice(index, 1);
  //     this.cexs = this.cexs.slice(0);
  //   }
  //   return index !== -1;
  // });

  // _getCexPosition = (id: string) => {
  //   return this.cexs.findIndex(o => {
  //     return o.id === id;
  //   });
  // };
}

export const BankStore: bankStore = new bankStore();
