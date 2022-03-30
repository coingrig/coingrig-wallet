/* eslint-disable no-undef */
import axios from 'axios';

const APP_URI = {
  ETH: 'https://api.0x.org/swap/v1',
  BSC: 'https://bsc.api.0x.org/swap/v1',
  POLYGON: 'https://polygon.api.0x.org/swap/v1',
};

class SwapService {
  data: any;
  constructor() {}

  getQuote = async (chain, params) => {
    const url = `${APP_URI[chain]}/quote`;
    let response = null;
    try {
      response = await axios.get(url, {
        params: params,
      });
    } catch (ex) {
      console.log(ex.response.data);
      if (ex.response && ex.response.data) {
        throw ex.response.data.reason;
      }
    }
    return response?.data || null;
  };
}
//@ts-ignore
export default new SwapService();
