/* eslint-disable no-undef */
import {Linking} from 'react-native';
import CONFIG from '../config';
import appStates from './appStates';
import {Logs} from './logs';

class DeepLinkService {
  data: any;
  constructor() {
    // this.getUrl();
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
    if (CONFIG.navigation.navigate && !appStates.coldStart) {
      Logs.info(CONFIG.navigation);
      this.handleDeepLink(this.data);
    }
  };

  handleDeepLink = data => {
    switch (data[0]) {
      case 'add':
        this.addNewToken(data);
        break;
      default:
        break;
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
    urlToParse = urlToParse.url || null;
    if (!urlToParse) {
      return null;
    }
    urlToParse = urlToParse.replace('coingrig://', '');
    urlToParse = urlToParse.split('/');
    return urlToParse;
  };
}
//@ts-ignore
export default new DeepLinkService();
