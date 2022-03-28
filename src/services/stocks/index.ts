import CONFIG from 'config';
import {Logs} from 'services/logs';
import {MarketStore} from 'stores/market';
import {IStocks, StockStore} from 'stores/StockStore';
import endpoints from 'utils/endpoints';
var axios = require('axios');

class StockService {
  constructor() {}

  getMarkets = async () => {
    const query = [
      '^GSPC',
      '^DJI',
      'CL=F',
      'GC=F',
      '^N225',
      '^FTSE',
      '^IXIC',
      '^GDAXI',
    ];
    try {
      const url = endpoints.stocks + 'quote/quote?symbols=' + query;
      const config = {
        method: 'get',
        url: url,
        headers: {
          ApiKey: CONFIG.COINGRIG_KEY,
        },
      };
      const response = await axios(config);
      const markets = {};
      response.data.forEach(item => {
        markets[item.symbol] = item;
      });
      MarketStore.setMarkets(markets);
    } catch (err) {
      console.log(err);
    }
  };

  getStocks = async query => {
    try {
      const url = endpoints.stocks + 'quote/quote?symbols=' + query;
      const config = {
        method: 'get',
        url: url,
        headers: {
          ApiKey: CONFIG.COINGRIG_KEY,
        },
      };
      const response = await axios(config);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  search = async query => {
    try {
      const url = endpoints.stocks + 'search/search?q=' + query;
      const config = {
        method: 'get',
        url: url,
        headers: {
          ApiKey: CONFIG.COINGRIG_KEY,
        },
      };
      const response = await axios(config);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  add = async (stock: IStocks) => {
    StockStore.addStock(stock);
  };

  remove = async (stockID: string) => {
    StockStore.deleteStockById(stockID);
  };

  updateBalance = async (stockID: string, stock: IStocks) => {
    StockStore.updateStock(stockID, stock);
  };

  updateAllStocks = async () => {
    const symbolList = StockStore.getSymbolList();
    if (symbolList.length === 0) {
      return;
    }
    const newStockData = await this.getStocks(symbolList);
    newStockData.forEach(stock => {
      StockStore.updatePrices(
        stock.symbol,
        stock.price,
        stock.changePercentage,
      );
      Logs.info(stock);
    });
  };
}
// @ts-ignore
export default new StockService();
