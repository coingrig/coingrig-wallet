import {makeAutoObservable, action} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORED_MNEMONIC} from '../utils/constants';
import {CryptoService} from '../services/crypto';
import {StorageSetItem} from '../services/storage';
import CONFIG from 'config';
import {WalletFactory, WalletGenerator} from '@coingrig/core';

export interface IWalletAddresses {
  chain: string;
  walletAddress: string;
}

export interface IWallet {
  symbol: string;
  name: string;
  cid: string | null;
  chain: string;
  privKey: string | null;
  walletAddress: string | null;
  type: string;
  contract: string | null;
  decimals: number;
  image: string | null;
  balance: number;
  unconfirmedBalance: number;
  value: number;
  price: number;
  active: true;
}

class WalletStoreModule {
  // Gets populated after reading the wallet
  wallets: IWallet[] = [];
  walletAddresses: IWalletAddresses[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'WalletStore',
      properties: ['wallets', 'walletAddresses'],
      storage: AsyncStorage,
    });
  }

  setWallets = action((wallets: IWallet[]) => {
    this.wallets = wallets;
  });

  addWallet = action((wallet: IWallet) => {
    this.wallets = this.wallets.concat([wallet]);
  });

  deleteWallet = action((index: number) => {
    this.wallets.splice(index, 1);
  });

  addWalletAddress = action((wallet: IWalletAddresses) => {
    this.walletAddresses.push(wallet);
  });

  getWalletAddressByChain = (chain: String) => {
    let found = this.walletAddresses.find((o: IWalletAddresses) => {
      return o.chain === chain;
    });
    if (found) {
      return found.walletAddress;
    }
    return null;
  };

  getWalletByCoinId = (symbol: String) => {
    return this.wallets.find((o: IWallet) => {
      return o.symbol === symbol;
    });
  };

  getWalletByCoinName = (name: String) => {
    return this.wallets.find((o: IWallet) => {
      return o.name === name;
    });
  };

  getCoinIdsList = () => {
    return this.wallets.map(o => {
      return o.symbol;
    });
  };

  getCoinNamesList = () => {
    return this.wallets.map(o => {
      return o.name;
    });
  };

  getCoinCIDList = () => {
    return this.wallets.map(o => {
      return o.cid;
    });
  };

  _getWalletPosition = (symbol: string) => {
    return this.wallets.findIndex(o => {
      return o.symbol === symbol;
    });
  };

  setName = action((symbol: string, name: string) => {
    let pos = this._getWalletPosition(symbol);
    if (pos !== -1) {
      this.wallets[pos].name = name;
    }
    this.wallets = this.wallets.splice(0);
  });

  setBalance = action((symbol: string, balance: number) => {
    let pos = this._getWalletPosition(symbol);
    if (pos !== -1) {
      this.wallets[pos].balance = balance;
      this.wallets[pos].value =
        this.wallets[pos].balance * this.wallets[pos].price;
    }
    this.wallets = this.wallets.splice(0);
  });

  setUnconfirmedBalance = action((symbol: string, balance: number) => {
    let pos = this._getWalletPosition(symbol);
    if (pos !== -1) {
      this.wallets[pos].unconfirmedBalance = balance;
    }
    this.wallets = this.wallets.splice(0);
  });

  setPrice = action((symbol: string, price: number) => {
    let pos = this._getWalletPosition(symbol);
    if (pos !== -1) {
      this.wallets[pos].price = price;
      this.wallets[pos].value =
        this.wallets[pos].balance * this.wallets[pos].price;
    }
    this.wallets = this.wallets.splice(0);
  });

  get totalBalance() {
    return Object.values(this.wallets).reduce((sum, o) => {
      return sum + o.value;
    }, 0);
  }

  createWallets = async (mnemonic: string, coinList: any[] = []) => {
    let keys = CryptoService.getChainPrivateKeys();
    try {
      for (const coinDescriptor of coinList) {
        let coin = coinDescriptor.symbol;
        let privKey = keys[coinDescriptor.chain];
        if (!privKey) {
          privKey = await WalletGenerator.generatePrivateKeyFromMnemonic(
            coin,
            mnemonic,
            CONFIG.DEFAULT_DERIVATION_KEY,
          );
          keys[coinDescriptor.chain] = privKey;
        }
        let address = this.getWalletAddressByChain(coinDescriptor.chain);
        if (!address) {
          let xpub = await WalletGenerator.generateWalletXpub(coin, mnemonic);
          address = await WalletGenerator.generateAddressFromXPub(
            coin,
            xpub,
            CONFIG.DEFAULT_DERIVATION_KEY,
          );
          this.addWalletAddress({
            chain: coinDescriptor.chain,
            walletAddress: address!,
          });
        }
        let _config = Object.assign({}, coinDescriptor);
        let wallet = WalletFactory.getWallet(_config);
        const ballance = await wallet.getBalance();
        _config = Object.assign({}, _config, {
          balance: ballance.getValue(),
          value: 0,
          price: 0,
        });
        this.addWallet(_config);
      }
      CryptoService.setChainPrivateKeys(keys);
      CONFIG.mnemonic = mnemonic;
      await StorageSetItem(STORED_MNEMONIC, mnemonic, true);
      StorageSetItem('@init', 'init', false);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}

export const WalletStore = new WalletStoreModule();
