import {COINS_MIN, STORED_CHAIN_KEYS} from 'utils/constants';
import {MarketStore} from 'stores/market';
import {WalletStore} from 'stores/wallet';
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
}

let service = new CryptoService();
export {service as CryptoService};
