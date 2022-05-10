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
    const config: any = {
      method: 'get',
      url: endpoints.fx,
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
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
