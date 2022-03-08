import {Logs} from 'services/logs';
import endpoints from 'utils/endpoints';
var axios = require('axios');

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
      })
      .catch(function (error) {
        Logs.error(error);
      });
  };
}
// @ts-ignore
export default new FXService();
