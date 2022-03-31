import {Logs} from 'services/logs';
import {FiatStore} from 'stores/fiatStore';
import endpoints from 'utils/endpoints';
import axios from 'axios';
import {FxStore} from 'stores/fxStore';
import BanksService from 'services/banks';
import {CexStore} from 'stores/cexStore';

class FXService {
  constructor() {
    this.fetchFX();
  }
  fetchFX = async () => {
    var config = {
      method: 'get',
      url: endpoints.fx,
    };

    axios(config)
      .then(response => {
        const rates = response.data.rates;
        FxStore.setRates(rates);
        BanksService.updateTotalBalance();
        FiatStore.updateAllBalances();
        CexStore.updateFiatAccounts();
      })
      .catch(function (error) {
        Logs.error(error);
      });
  };
}
// @ts-ignore
export default new FXService();
