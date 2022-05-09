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

  sumTotalBalance() {
    return this.stocks.reduce(
      (total, stock) => total + stock.qty * stock.price,
      0.0,
    );
  }

  updateTotalBalance = action((balance: number) => {
    this.totalBalance = balance;
  });

  updateStock = action((id: string, data: IStocks) => {
    const pos = this.getStockPosition(id);
    if (pos !== -1) {
      this.stocks[pos] = data;
    }
    this.stocks = this.stocks.splice(0);
  });

  updatePrices = action((id: string, price: number, change: number) => {
    const pos = this.getStockPosition(id);
    if (pos !== -1) {
      this.stocks[pos].change = change;
      this.stocks[pos].price = price;
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
    const index = this.getStockPosition(id);
    if (index !== -1) {
      this.stocks.splice(index, 1);
      this.stocks = this.stocks.slice(0);
    }
    return index !== -1;
  });

  updateAllBalances = action(() => {
    this.updateTotalBalance(this.sumTotalBalance());
  });

  private getStockPosition = (id: string) => {
    return this.stocks.findIndex(o => {
      return o.id === id;
    });
  };
}

export const StockStore: stockStore = new stockStore();
