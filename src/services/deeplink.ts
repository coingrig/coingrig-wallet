/* eslint-disable no-undef */
import {Linking} from 'react-native';
import CONFIG from '../config';

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
    this.handleDeepLink(this.data);
  };

  urlListener = newUrl => {
    if (!newUrl) {
      return;
    }
    this.data = this.parseUrl(newUrl);
    this.handleDeepLink(this.data);
  };

  handleDeepLink = data => {
    //
    console.log(data);
  };

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
