import CONFIG from 'config';
import {Logs} from 'services/logs';
import {BankStore, IBankAccount} from 'stores/bankStore';
import endpoints from 'utils/endpoints';
var axios = require('axios');

class BanksService {
  accessToken: string | null = null;
  generatedTime: any;
  expireTime: any;

  constructor() {
    // this.getKeys();
  }

  getKeys = async () => {
    try {
      if (!this.accessToken) {
        return await this.generateKey();
      } else {
        const now = Math.round(Date.now() / 1000);
        if (now - this.generatedTime > this.expireTime) {
          return await this.generateKey();
        } else {
          Logs.info('Token is valid');
          return this.accessToken;
        }
      }
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  private getAccountDetails = async id => {
    const config = {
      method: 'get',
      url: endpoints.nordigen + '/accounts/' + id + '/details/',
    };
    try {
      const response = await this.request(config);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  private getAccountBalance = async id => {
    const config = {
      method: 'get',
      url: endpoints.nordigen + '/accounts/' + id + '/balances/',
    };
    try {
      const response = await this.request(config);
      // console.log(response.data);
      const data = response.data.balances;
      let balance = data.find((o: any) => {
        return o.balanceType === 'expected';
      });
      if (!balance) {
        balance = data.find((o: any) => {
          return o.balanceType === 'interimAvailable';
        });
      }
      return balance;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  createAccount = async (accountID, accData) => {
    try {
      const {balance, details}: any = await this.getBankAccountData(accountID);
      const bankAccount: IBankAccount = {
        id: accountID,
        iban: details.account.iban || null,
        currency: balance.balanceAmount.currency || null,
        name: details.account.name || null,
        product: details.account.product || null,
        amount: parseFloat(balance.balanceAmount.amount) || null,
        balanceType: balance.balanceType || null,
        bankName: accData.item.name || null,
        bankLogo: accData.item.logo,
        ownerName: details.account.ownerName || null,
        bankID: accData.item.id || null,
      };
      BankStore.addAccount(bankAccount);
    } catch (error) {
      // TODO alert cannot create account
      throw error;
    }
  };

  getBankAccountData = async (accountID: string) => {
    const details = await this.getAccountDetails(accountID);
    const balance = await this.getAccountBalance(accountID);
    return {details, balance};
  };

  fetchAccountsList = async (accountID: string) => {
    const config = {
      method: 'get',
      url: endpoints.nordigen + '/requisitions/' + accountID + '/',
    };
    try {
      const response = await this.request(config);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  createAuthLink = async (bankID: string, aggrementID: string) => {
    // will return accountID (id)
    const rid = this.getRandomID();
    // console.log(rid);
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
      // console.log(response.data);
      return response.data;
    } catch (error) {
      Logs.error('createAuthLink', error);
      return null;
    }
  };

  getAggrement = async (bankID: string) => {
    // "SANDBOXFINANCE_SFIN0000"
    const data: string = JSON.stringify({
      institution_id: bankID,
    });
    const config = {
      method: 'post',
      url: endpoints.nordigen + '/agreements/enduser/',
      data: data,
    };
    try {
      const agreement = await this.request(config);
      // console.log(agreement.data);
      return agreement.data;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  getBanks = async (countryCode: string) => {
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
      // console.log(response.data);
      return response.data;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  request = async config => {
    const token = await this.getKeys();
    if (!token) {
      throw 'No token';
    }
    config.headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
    // console.log(config);
    return axios(config);
  };

  generateKey = async () => {
    try {
      const config = {
        method: 'post',
        url: endpoints.psd,
        headers: {
          ApiKey: CONFIG.COINGRIG_KEY,
        },
      };
      const response = await axios(config);
      this.accessToken = response.data.access;
      this.generatedTime = Math.round(Date.now() / 1000);
      this.expireTime = response.data.access_expires;
      Logs.info('Generate new token');
      return this.accessToken;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  getRandomID = () => {
    const r = Math.floor(Math.random() * 999999);
    const random = r + '' + Date.now();
    return random;
  };
}

export default new BanksService();
