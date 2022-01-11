/* eslint-disable no-undef */
var axios = require('axios');
import {Linking} from 'react-native';
import CONFIG from '../config';
import appStates from './appStates';
import {Logs} from './logs';

let APP_URI = {
  ETH: 'https://api.0x.org/swap/v1',
  BSC: 'https://bsc.api.0x.org/swap/v1',
  POLYGON: 'https://polygon.api.0x.org/swap/v1',
};

class SwapService {
  data: any;
  constructor() {}

  getQuote = async (chain, params) => {
    let url = `${APP_URI[chain]}/quote`;
    console.log(url);
    console.log(params);
    let response = null;
    try {
      response = await axios.get(url, {
        params: params,
      });
    } catch (ex) {}
    return response?.data || null;
  };
}
//@ts-ignore
export default new SwapService();
