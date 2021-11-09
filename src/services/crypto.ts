var axios = require('axios');
import {COINS_MIN, STORED_CHAIN_KEYS} from 'utils/constants';
import {MarketStore} from 'stores/market';
import {IWallet, IWalletAddresses, WalletStore} from 'stores/wallet';
import {WalletFactory} from '@coingrig/core';
import {StorageSetItem, StorageGetItem} from './storage';
import endpoints from 'utils/endpoints';
import CONFIG from 'config';

class CryptoService {
  lastFetchedBalance = 0;

  setChainPrivateKeys = async keys => {
    return StorageSetItem(STORED_CHAIN_KEYS, JSON.stringify(keys), true);
  };

  getChainPrivateKeys = async () => {
    let storedKeys: any = await StorageGetItem(STORED_CHAIN_KEYS, true);
    if (!storedKeys) {
      return {};
    }
    return JSON.parse(storedKeys);
  };

  getBlockExplorer = (chain: string) => {
    switch (chain) {
      case 'BTC':
        return (
          endpoints.btc +
          'address/' +
          WalletStore.getWalletAddressByChain(chain)
        );
      case 'ETH':
        return (
          endpoints.eth +
          'address/' +
          WalletStore.getWalletAddressByChain(chain)
        );
      default:
        break;
    }
  };

  getTxExplorer = (chain: string, tx: string) => {
    switch (chain) {
      case 'BTC':
        return endpoints.btc + 'tx/' + tx;
      case 'ETH':
        return endpoints.eth + 'tx/' + tx;
      default:
        break;
    }
  };

  getAccountBalance = async () => {
    const now = Date.now();
    if (now - this.lastFetchedBalance! < CONFIG.BALANCE_TIMEOUT * 1000) {
      return true;
    }
    this.lastFetchedBalance = now;
    try {
      const tokenBalances = await this.getBulkTokenBalance(
        WalletStore.walletAddresses,
      );

      if (MarketStore.coins.length <= 10) {
        let coins = await MarketStore.getTopCoins(COINS_MIN);
        if (!coins) {
          return false;
        }
      }
      let prices = await MarketStore.getCoinsByList(
        WalletStore.getCoinNamesList(),
      );
      let chainKeys = await this.getChainPrivateKeys();
      for (let i = 0; i < WalletStore.wallets.length; i++) {
        let chain = WalletStore.wallets[i].chain;
        let wallet = Object.assign({}, WalletStore.wallets[i], {
          privKey: chainKeys[chain],
          walletAddress: WalletStore.getWalletAddressByChain(chain),
        });
        // Don't update the price if none is available from the provider
        let newPrice = prices[wallet.name.toLowerCase()]?.usd ?? null;
        if (newPrice !== null) {
          // The price can be actually 0
          newPrice = parseFloat(newPrice);
          WalletStore.setPrice(wallet.symbol, newPrice);
        }
        let cryptoWallet = WalletFactory.getWallet(wallet);
        const balance = await cryptoWallet.getBalance();
        const unconfirmedBalance = balance.getUnconfirmedBalance();
        WalletStore.setBalance(wallet.symbol, balance.getValue());
        WalletStore.setUnconfirmedBalance(wallet.symbol, unconfirmedBalance);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  getCoinDetails = symbol => {
    var config = {
      method: 'get',
      url:
        'https://api.coingecko.com/api/v3/coins/' + symbol + '?sparkline=true',
    };

    return axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return error;
      });
  };
  CHAIN_ID_MAP = {
    ETH: 1,
    BSC: 56,
    POLYGON: 137,
  };
  getBulkTokenBalance = (walletAddresses: IWalletAddresses[]) => {
    console.log(walletAddresses);
    for (let index = 0; index < walletAddresses.length; index++) {
      const item = walletAddresses[index];
      var config = {
        method: 'get',
        url: `https://api.covalenthq.com/v1/${
          this.CHAIN_ID_MAP[item.chain]
        }/address/${
          item.walletAddress
        }/balances_v2/?&key=ckey_ff9e0a7cfbf94e189b759ef53f`,
      };

      return axios(config)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          return error;
        });
    }
  };

  getChainbyName = name => {
    switch (name) {
      case 'ethereum':
        return 'ETH';
      case 'binance-smart-chain':
        return 'BSC';
      case 'polygon-pos':
        return 'POLYGON';
      default:
        return '';
    }
  };

  prepareNewWallet = async (data, network) => {
    const chain = this.getChainbyName(network);
    let testw: IWallet = {
      symbol: 'CGTEST',
      name: 'CGTEST',
      cid: null,
      chain: chain,
      type: 'token',
      decimals: 18,
      contract: '0xaf3acd9361fd975427761adfe1ca234c88137a06',
      walletAddress: null,
      privKey: null,
      balance: 0,
      unconfirmedBalance: 0,
      value: 0,
      price: 0,
      active: true,
      image: data.image?.large || null,
    };

    // let wallet: IWallet = {
    //   symbol: data.symbol.toUpperCase(),
    //   name: data.name,
    //   cid: data.id,
    //   chain: chain,
    //   type: 'token',
    //   decimals: 18,
    //   contract: data.platforms[network] || null,
    //   privKey: null,
    //   balance: 0,
    //   unconfirmedBalance: 0,
    //   value: 0,
    //   price: data.market_data?.current_price?.usd ?? null,
    //   active: true,
    //   image: data.image?.large || null,
    //   walletAddress: null,
    // };
    // console.log(wallet);
    // console.log(testw);
    WalletStore.addWallet(testw);
  };
}

let service = new CryptoService();
export {service as CryptoService};
