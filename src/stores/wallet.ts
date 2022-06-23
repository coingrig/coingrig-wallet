import {makeAutoObservable, action} from 'mobx';
import {makePersistable, isHydrated, hydrateStore} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORED_MNEMONIC} from '../utils/constants';
import {CryptoService} from '../services/crypto';
import {StorageSetItem} from '../services/storage';
import CONFIG from 'config';
import {WalletFactory, WalletGenerator} from '@coingrig/core';
import {generateWallet} from '@coingrig/wallet-generator';
import {Platform} from 'react-native';

export interface IWalletAddresses {
  chain: string;
  walletAddress: string;
}

export interface IWallet {
  symbol: string; // the asset's contract symbol
  name: string; // the asset's contract name
  cid: string | null; // price finder ID
  chain: string; // the blockchain ID
  privKey: string | null;
  walletAddress: string | null; // the address under which the asset is held
  type: string; // internal asset type tracker
  contract: string | null; // the asset's contract address
  decimals: number | null; // the aseet's contract decimals
  image: string | null; //  the URL to the logo of the asset
  balance: number; // base on confirmed transactions
  unconfirmedBalance: number; // based on pending transactions
  value: number; // balance * price
  price: number; // market price of the asset
  active: true; // displayed in the UI
  version: number; // configuration version
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

  get isHydrated() {
    return isHydrated(this);
  }

  async hydrateStore() {
    await hydrateStore(this);
  }

  setWallets = action((wallets: IWallet[]) => {
    this.wallets = wallets;
  });

  addWallet = action((wallet: IWallet) => {
    this.wallets = this.wallets.concat([wallet]);
  });

  deleteWallet = action((index: number) => {
    this.wallets.splice(index, 1);
    this.wallets = this.wallets.slice(0);
  });

  deleteWalletByCoinId = action((symbol: string, chain: string) => {
    const index = this._getWalletPosition(symbol, chain);
    if (index !== -1) {
      this.wallets.splice(index, 1);
      this.wallets = this.wallets.slice(0);
    }
    return index !== -1;
  });

  addWalletAddress = action((wallet: IWalletAddresses) => {
    this.walletAddresses.push(wallet);
  });

  getWalletAddressByChain = (chain: String) => {
    const found = this.walletAddresses.find((o: IWalletAddresses) => {
      return o.chain === chain;
    });
    if (found) {
      return found.walletAddress;
    }
    return null;
  };

  getWalletByCoinId = (symbol: String, chain: String) => {
    return this.wallets.find((o: IWallet) => {
      return o.symbol === symbol && o.chain === chain;
    });
  };

  getWalletByCoinName = (name: String, chain: String) => {
    return this.wallets.find((o: IWallet) => {
      return o.name === name && o.chain === chain;
    });
  };

  getWalletByCoinContract = (contract: String, chain: String) => {
    return this.wallets.find((o: IWallet) => {
      return o.contract === contract && o.chain === chain;
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

  _getWalletPosition = (symbol: string, chain: String) => {
    return this.wallets.findIndex(o => {
      return o.symbol === symbol && o.chain === chain;
    });
  };

  setName = action((symbol: string, chain: String, name: string) => {
    const pos = this._getWalletPosition(symbol, chain);
    if (pos !== -1) {
      this.wallets[pos].name = name;
    }
    this.wallets = this.wallets.slice(0);
  });

  setBalance = action((symbol: string, chain: String, balance: number) => {
    const pos = this._getWalletPosition(symbol, chain);
    if (pos !== -1) {
      this.wallets[pos].balance = balance;
      this.wallets[pos].value =
        this.wallets[pos].balance * this.wallets[pos].price;
    }
    this.wallets = this.wallets.slice(0);
  });

  setUnconfirmedBalance = action(
    (symbol: string, chain: String, balance: number) => {
      const pos = this._getWalletPosition(symbol, chain);
      if (pos !== -1) {
        this.wallets[pos].unconfirmedBalance = balance;
      }
      this.wallets = this.wallets.slice(0);
    },
  );

  setPrice = action((symbol: string, chain: String, price: number) => {
    const pos = this._getWalletPosition(symbol, chain);
    if (pos !== -1) {
      this.wallets[pos].price = price;
      this.wallets[pos].value =
        this.wallets[pos].balance * this.wallets[pos].price;
    }
    this.wallets = this.wallets.slice(0);
  });

  get totalBalance() {
    return Object.values(this.wallets).reduce((sum, o) => {
      return sum + o.value;
    }, 0);
  }

  createWallets = async (mnemonic: string, coinList: any[] = []) => {
    const keys = await CryptoService.getChainPrivateKeys();
    try {
      for (const coinDescriptor of coinList) {
        const coin = coinDescriptor.symbol;
        let privKey = keys[coinDescriptor.chain];
        let newWallet: any = null;
        const chainType =
          coinDescriptor.chain === 'BSC' ||
          coinDescriptor.chain === 'POLYGON' ||
          coinDescriptor.chain === 'ETH'
            ? 'ETH'
            : 'BTC';
        if (!privKey) {
          // If the chain being setup is an ETH based chain
          // then use the ETH key
          if (
            (coinDescriptor.chain === 'BSC' ||
              coinDescriptor.chain === 'POLYGON') &&
            keys.ETH
          ) {
            keys[coinDescriptor.chain] = keys.ETH;
          } else {
            try {
              newWallet = await generateWallet(mnemonic, chainType);
              newWallet = JSON.parse(newWallet);
              keys[coinDescriptor.chain] = newWallet.privateKey;
            } catch (error) {
              privKey = await WalletGenerator.generatePrivateKeyFromMnemonic(
                coin,
                mnemonic,
                CONFIG.DEFAULT_DERIVATION_KEY,
              );
              keys[coinDescriptor.chain] = privKey;
            }
          }
        }
        let address = this.getWalletAddressByChain(coinDescriptor.chain);
        if (!address) {
          // If the chain being setup is an ETH based chain
          // then use the ETH address
          const ethAddress = this.getWalletAddressByChain('ETH')!;
          if (
            (coinDescriptor.chain === 'BSC' ||
              coinDescriptor.chain === 'POLYGON') &&
            ethAddress
          ) {
            this.addWalletAddress({
              chain: coinDescriptor.chain,
              walletAddress: ethAddress,
            });
          } else {
            // Create the new wallet chain address
            try {
              if (!newWallet) {
                newWallet = await generateWallet(mnemonic, chainType);
                newWallet = JSON.parse(newWallet);
                address = newWallet.address;
              } else {
                address = newWallet.address;
              }
              this.addWalletAddress({
                chain: coinDescriptor.chain,
                walletAddress: address!,
              });
            } catch (error) {
              const xpub = await WalletGenerator.generateWalletXpub(
                coin,
                mnemonic,
              );
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
          }
        }
        let _config = Object.assign({}, coinDescriptor);
        const wallet = WalletFactory.getWallet(_config);
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
      StorageSetItem(CONFIG.INIT_KEY, 'init', false);
      const buildNumber =
        Platform.OS === 'android'
          ? CONFIG.BUILD_NUMBER_ANDROID
          : CONFIG.BUILD_NUMBER_IOS;
      // Store migration key to current app version
      StorageSetItem(CONFIG.MIGRATION_KEY, buildNumber.toString(), false);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}

export const WalletStore = new WalletStoreModule();
