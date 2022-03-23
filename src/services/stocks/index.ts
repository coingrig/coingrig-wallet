import {Logs} from 'services/logs';
import {IStocks, StockStore} from 'stores/StockStore';
import endpoints from 'utils/endpoints';
var axios = require('axios');

class StockService {
  constructor() {}

  getStocks = async query => {
    try {
      const url = endpoints.stocks + 'quote/quote?symbols=' + query;
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  search = async query => {
    try {
      const url = endpoints.stocks + 'search/search?q=' + query;
      const response = await axios.get(url);
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
}
// @ts-ignore
export default new StockService();
