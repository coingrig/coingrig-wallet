import CONFIG from 'config';
import {Logs} from 'services/logs';
import {
  StorageDeleteItem,
  StorageGetItem,
  StorageSetItem,
} from 'services/storage';
import {BankStore, IBankAccount} from 'stores/bankStore';
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

  // getBalance = async () => {};

  // getAllBalances = async () => {};

  // getBankAccounts = async () => {};

  // setBankAccounts = async () => {};

  // setBalance = async () => {};

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
    config.headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.accessToken,
    };
    // console.log(config);
    return axios(config);
  };

  getRandomID = () => {
    const r = Math.floor(Math.random() * 999999);
    const random = r + '' + Date.now();
    return random;
  };
}

export default new BanksService();
