/* eslint-disable no-undef */
import {Linking} from 'react-native';
import CONFIG from '../config';
import appStates from './appStates';
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
    Logs.info(this.data);
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
