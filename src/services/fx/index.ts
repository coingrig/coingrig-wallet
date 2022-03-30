import {Logs} from 'services/logs';
import {FiatStore} from 'stores/fiatStore';
import endpoints from 'utils/endpoints';
import axios from 'axios';

class FXService {
  rates: any;
  constructor() {
    this.rates = null;
    this.fetchFX();
  }
  fetchFX = async () => {
    var config = {
      method: 'get',
      url: endpoints.fx,
    };

    axios(config)
      .then(response => {
        this.rates = response.data.rates;
        FiatStore.updateAllBalances();
      })
      .catch(function (error) {
        Logs.error(error);
      });
  };
}
// @ts-ignore
export default new FXService();
