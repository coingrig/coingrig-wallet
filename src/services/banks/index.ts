import CONFIG from 'config';
import {Logs} from 'services/logs';
import {
  StorageDeleteItem,
  StorageGetItem,
  StorageSetItem,
} from 'services/storage';
import endpoints from 'utils/endpoints';
var axios = require('axios');

class BanksService {
  accessToken: string | null = null;
  //   accessExpireTimestamp: number = 0;
  //   refreshToken: string = '';
  //   refresh_expires: number = 0;

  constructor() {
    this.getKeys();
    // console.log(this.accessToken);
  }

  getKeys = async () => {
    // TODO get it from the encrypted storage OR generate a new one
    this.accessToken = CONFIG.BANK_TOKEN;
  };

  getBalance = async () => {};

  getAllBalances = async () => {};

  getBankAccounts = async () => {};

  setBankAccounts = async () => {};

  setBalance = async () => {};

  fetchAccountsList = async accountID => {
    const config = {
      method: 'get',
      url: endpoints.nordigen + '/requisitions/' + accountID,
    };
    try {
      const response = await this.request(config);
      console.log(response.data);
      return response.data;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  createAuthLink = async (bankID, aggrementID) => {
    // will return accountID (id)
    const rid = this.getRandomID();
    console.log(rid);
    var data = JSON.stringify({
      redirect: endpoints.bank_redirect,
      institution_id: bankID,
      reference: rid,
      agreement: aggrementID,
      user_language: 'EN',
    });
    const config = {
      method: 'post',
      url: endpoints.nordigen + '/requisitions/',
      data: data,
    };
    try {
      const response = await this.request(config);
      console.log(response.data);
      return response.data;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  getAggrement = async bankID => {
    // "SANDBOXFINANCE_SFIN0000"
    const data = JSON.stringify({
      institution_id: bankID,
    });
    const config = {
      method: 'post',
      url: endpoints.nordigen + '/agreements/enduser/',
      data: data,
    };
    try {
      const agreement = await this.request(config);
      console.log(agreement.data);
      return agreement.data;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  getBanks = async countryCode => {
    const url =
      endpoints.nordigen +
      '/institutions/?country=' +
      countryCode.toLowerCase();

    const config = {
      method: 'get',
      url: url,
    };
    try {
      const response = await this.request(config);
      console.log(response.data);
      return response.data;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  request = async config => {
    config.headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken,
    };
    console.log(config);
    return axios(config);
  };

  getRandomID = () => {
    const r = Math.floor(Math.random() * 999999);
    const random = r + '' + Date.now();
    return random;
  };
}

export default new BanksService();
