import {action, makeAutoObservable} from 'mobx';
import {hydrateStore, isHydrated, makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type IStocks = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  qty: number;
  change: number;
};

class stockStore {
  stocks: IStocks[] = [];
  totalBalance: number = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'StockStore',
      properties: ['stocks', 'totalBalance'],
      storage: AsyncStorage,
    });
  }

  async hydrateStore() {
    await hydrateStore(this);
  }

  get isHydrated() {
    return isHydrated(this);
  }

  getSymbolList = () => {
    return this.stocks.map((o: IStocks) => {
      return o.symbol;
    });
  };

  updateTotalBalance = action((balance: number) => {
    this.totalBalance = balance;
  });

  updateStock = action((id: string, data: IStocks) => {
    let pos = this.getStockPosition(id);
    if (pos !== -1) {
      this.stocks[pos] = data;
    }
    this.stocks = this.stocks.splice(0);
  });

  addStock = action((stock: IStocks) => {
    this.stocks.push(stock);
    return true;
  });

  getStockById = (id: string) => {
    return this.stocks.find((o: IStocks) => {
      return o.id === id;
    });
  };

  deleteStockById = action((id: string) => {
    let index = this.getStockPosition(id);
    if (index !== -1) {
      this.stocks.splice(index, 1);
      this.stocks = this.stocks.slice(0);
    }
    return index !== -1;
  });

  updateAllBalances = action(() => {
    // let _totalBalance = 0;
    // this.stocks.forEach(item => {
    //   item.usdBalance = item.balance / fx.rates[item.currency];
    //   _totalBalance = _totalBalance + item.usdBalance;
    // });
    // this.stocks = this.stocks.splice(0);
  });

  private getStockPosition = (id: string) => {
    return this.stocks.findIndex(o => {
      return o.id === id;
    });
  };
}

export const StockStore: stockStore = new stockStore();
