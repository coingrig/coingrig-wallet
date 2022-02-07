/* eslint-disable no-undef */
import {Linking} from 'react-native';
import {WalletStore} from 'stores/wallet';
import CONFIG from '../config';
import appStates from './appStates';
import {CryptoService} from './crypto';
import {Logs} from './logs';

class DeepLinkService {
  data: any;
  constructor() {
    this.getUrl();
    Linking.addEventListener('url', this.urlListener);
  }
  getUrl = async () => {
    const newUrl = await Linking.getInitialURL();
    if (!newUrl) {
      return;
    }
    this.data = this.parseUrl(newUrl);
  };

  urlListener = newUrl => {
    if (!newUrl) {
      return;
    }
    this.data = this.parseUrl(newUrl);
    Logs.info('urlListener', this.data);
    if (
      CONFIG.navigation &&
      CONFIG.navigation.navigate &&
      !appStates.coldStart
    ) {
      Logs.info(CONFIG.navigation);
      this.handleDeepLink(this.data);
    }
  };

  handleDeepLink = data => {
    switch (data[0]) {
      case 'add':
        this.addNewToken(data);
        break;
      case 'wc':
        this.startWC(data[1]);
        break;
      case 'swap':
        this.startSwap(data);
        break;
      default:
        break;
    }
  };

  startWC(WCuri: any) {
    try {
      CONFIG.navigation.navigate('WalletconnectScreen', {
        uri: WCuri,
      });
      this.data = null;
    } catch (error) {
      Logs.error(error);
    }
  }

  startSwap = async (data: any) => {
    // Logs.info('startSwap', data);

    const checkTokenExists = async (chain, address) => {
      // Do we have a contract address
      if (address.startsWith('0x')) {
        // Check if it is already in portfolio
        return WalletStore.getWalletByCoinContract(address, chain);
      }
      // Check if address is the native asset of the chain symbol
      if (CryptoService.getChainNativeAsset(chain) === address.toUpperCase()) {
        return WalletStore.getWalletByCoinId(address.toUpperCase(), chain);
      }
      return undefined;
    };

    try {
      if (!WalletStore.isHydrated) {
        await WalletStore.hydrateStore();
      }

      let chain = data[1].toUpperCase();
      let fromToken = data[2];
      let toToken = data[3];

      let walletFrom = await checkTokenExists(chain, fromToken);
      let walletTo = await checkTokenExists(chain, toToken);

      if (walletFrom && walletTo) {
        // We have both assets already in portfolio, redirect to swap
        // CONFIG.navigation.goBack(null);
        CONFIG.navigation.navigate('SwapScreen', {
          chain: chain,
          wallet: walletFrom,
          buyWallet: walletTo,
          slippage: data[4],
        });
        this.data = null;
        return;
      }

      CONFIG.navigation.navigate('TokenConnectScreen', {
        chain: chain,
        from: fromToken,
        to: toToken,
        slippage: data[4],
      });
      this.data = null;
    } catch (error) {
      Logs.error(error);
    }
  };

  addNewToken(data: any) {
    try {
      CONFIG.navigation.navigate('CustomTokenScreen', {
        chain: data[1],
        token: data[2],
      });
      this.data = null;
    } catch (error) {
      Logs.error(error);
    }
  }

  parseUrl = (urlToParse: any) => {
    urlToParse = urlToParse.url || urlToParse;
    if (!urlToParse) {
      return null;
    }
    if (urlToParse.startsWith('wc:')) {
      return ['wc', urlToParse];
    }
    if (urlToParse.startsWith('coingrig://')) {
      urlToParse = urlToParse.replace('coingrig://', '');
      if (urlToParse.startsWith('wc')) {
        urlToParse = urlToParse.replace('wc?uri=', '');
        return ['wc', urlToParse];
      }
      urlToParse = urlToParse.split('/');
      return urlToParse;
    }
    if (urlToParse.includes('wc?uri=')) {
      const wc = urlToParse.replace('https://link.coingrig.com/wc?uri=', '');
      urlToParse = ['wc', wc];
    } else {
      urlToParse = urlToParse.replace('https://link.coingrig.com/', '');
      urlToParse = urlToParse.split('/');
    }
    return urlToParse;
  };
}
//@ts-ignore
export default new DeepLinkService();
