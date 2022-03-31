import CONFIG from 'config';
import {Logs} from 'services/logs';
import {BankStore, IBankAccount} from 'stores/bankStore';
import endpoints from 'utils/endpoints';
import axios from 'axios';
import {FxStore} from 'stores/fxStore';

class BanksService {
  accessToken: string | null = null;
  generatedTime: any;
  expireTime: any;

  constructor() {
    // this.getKeys();
    this.start();
  }

  async start() {
    try {
      if (!BankStore.isHydrated) {
        await BankStore.hydrateStore();
      }
    } catch (e) {
      Logs.error(e);
    }
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
      Logs.info('Account Balance : ', JSON.stringify(response.data));
      const data = response.data.balances;
      let balance = data.find((o: any) => {
        return (
          o.balanceType === 'expected' && Math.sign(o.balanceAmount.amount) >= 0
        );
      });
      if (!balance) {
        balance = data.find((o: any) => {
          return o.balanceType === 'interimAvailable';
        });
      }
      return balance || 0;
    } catch (error) {
      Logs.error(error);
      return null;
    }
  };

  addDays = days => {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return date.toDateString();
  };

  createAccount = async (accountID, accData) => {
    const exp = this.addDays(accData.aggrement.access_valid_for_days || 90);
    try {
      const {balance, details}: any = await this.getBankAccountData(accountID);
      // console.log('balance', balance);
      // console.log('details', details);
      const bankAccount: IBankAccount = {
        id: accountID,
        iban: details.account.iban || null,
        currency: balance.balanceAmount.currency || null,
        name: details.account.name || null,
        product: details.account.product || null,
        amount: parseFloat(balance.balanceAmount.amount) || 0,
        balanceType: balance.balanceType || null,
        bankName: accData.item.name || null,
        bankLogo: accData.item.logo,
        ownerName: details.account.ownerName || null,
        bankID: accData.item.id || null,
        expire: exp,
        offset: 0,
      };
      BankStore.addAccount(bankAccount);
    } catch (error) {
      // TODO alert cannot create account
      throw error;
    }
  };

  updateAccountsBalance = async () => {
    for (let index = 0; index < BankStore.bankAccounts.length; index++) {
      const account = {...BankStore.bankAccounts[index]};
      const {balance}: any = await this.getBankAccountData(account.id);
      account.amount =
        parseFloat(balance.balanceAmount.amount) + account.offset! || 0;
      BankStore.updateAccount(account.id, account);
    }
    this.updateTotalBalance();
  };

  updateAccountsOffset = async (id, offset) => {
    const fOffset = parseFloat(offset);
    const account = {...BankStore.getAccountById(id)};
    const {balance}: any = await this.getBankAccountData(id);
    try {
      if (account) {
        account.offset = fOffset ?? 0;
        account.amount =
          parseFloat(balance.balanceAmount.amount) + account.offset;
        account.amount = parseFloat(account.amount.toFixed(2));
        BankStore.updateAccount(id, account);
        console.log(account);
        this.updateTotalBalance();
      }
    } catch (error) {
      Logs.error(error);
    }
  };

  updateTotalBalance = async () => {
    const updateAction = () => {
      try {
        let newBalance = 0;
        for (let index = 0; index < BankStore.bankAccounts.length; index++) {
          const account = {...BankStore.bankAccounts[index]};
          const convertedBalance = FxStore.toUsd(
            account.amount,
            account.currency!,
          );
          if (convertedBalance !== undefined) {
            newBalance = newBalance + convertedBalance;
          }
        }
        BankStore.updateTotalBalance(newBalance);
      } catch (error) {
        Logs.error(error);
      }
    };
    if (!FxStore.isHydrated) {
      FxStore.hydrateStore().then(updateAction);
    } else {
      updateAction();
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
