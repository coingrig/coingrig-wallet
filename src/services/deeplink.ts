/* eslint-disable no-undef */
import {DeviceEventEmitter, Linking} from 'react-native';
import {WalletStore} from 'stores/wallet';
import {getChainByCoin} from 'utils';
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
      case 'closebrowser':
        this.closeBrowser();
        break;
      case 'add':
        this.addNewToken(data);
        break;
      case 'wc':
        this.startWC(data[1]);
        break;
      case 'swap':
        this.startSwap(data);
        break;
      case 'address':
        this.sendAddress(data);
        break;
      case 'screen':
        this.goToScreen(data);
        break;
      case 'web':
        this.startWeb(data[1]);
        break;
      default:
        break;
    }
  };

  goToScreen = (data: any) => {
    if (data.length >= 2) {
      const screen = data[1];
      CONFIG.navigation.navigate(screen);
    }
    this.data = null;
  };

  sendAddress = (data: any) => {
    if (data.length >= 3) {
      const coin = data[1];
      if (
        coin.toUpperCase() === 'BTC' ||
        coin.toUpperCase() === 'ETH' ||
        coin.toUpperCase() === 'BNB' ||
        coin.toUpperCase() === 'MATIC'
      ) {
        const address = data[2];
        CONFIG.navigation.navigate('SendReceiveScreen', {
          coin: coin.toUpperCase(),
          chain: getChainByCoin(coin.toUpperCase()),
          name: coin.toUpperCase(),
          to: address,
          receive: false,
        });
      }
    }
    this.data = null;
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

  startWeb(url: any) {
    try {
      CONFIG.navigation.navigate('WebScreen', {url});
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

      const chain = data[1].toUpperCase();
      const fromToken = data[2];
      const toToken = data[3];

      const walletFrom = await checkTokenExists(chain, fromToken);
      const walletTo = await checkTokenExists(chain, toToken);

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

  closeBrowser() {
    DeviceEventEmitter.emit('closeBrowser');
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
    } else if (urlToParse.includes('web?url=')) {
      // https://link.coingrig.com/web?url=https://medium.com/bloated-mvp/a16z-is-gaslighting-us-ea4161de2969
      const url = urlToParse.replace('https://link.coingrig.com/web?url=', '');
      urlToParse = ['web', url];
    } else {
      urlToParse = urlToParse.replace('https://link.coingrig.com/', '');
      urlToParse = urlToParse.split('/');
    }
    return urlToParse;
  };
}
//@ts-ignore
export default new DeepLinkService();
