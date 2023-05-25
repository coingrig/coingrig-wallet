import CONFIG from 'config';
import axios from 'axios';
import endpoints from 'utils/endpoints';
import {Logs} from 'services/logs';

export const RampProviders = {
  guardarian: {
    name: 'Guardarian',
    image: require('../../assets/hub/guardarian.png'),
    methods: require('../../assets/guardarian-methods.png'),
  },
  ramp: {
    name: 'Ramp',
    image: require('../../assets/hub/ramp.png'),
    methods: require('../../assets/ramp-methods.png'),
  },
};

export const buyFromGuardarian = async (
  val,
  currency,
  coin,
  address,
  chain,
) => {
  var data = JSON.stringify({
    from_amount: val,
    from_currency: currency,
    to_currency: coin,
    to_network: chain,
    payout_address: address,
  });

  var config: any = {
    method: 'post',
    url: 'https://api-payments.guardarian.com/v1/transaction',
    headers: {
      accept: '*/*',
      'x-api-key': CONFIG.GUARDARIAN_KEY,
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const r = await axios(config);
    return r.data.redirect_url;
  } catch (error) {
    Logs.error(error);
    return null;
  }
};

export const sellFromGuardarian = async (val, currency, coin, chain) => {
  var data = JSON.stringify({
    from_amount: val,
    from_currency: coin,
    to_currency: currency,
    from_network: chain,
  });

  var config: any = {
    method: 'post',
    url: 'https://api-payments.guardarian.com/v1/transaction',
    headers: {
      accept: '*/*',
      'x-api-key': CONFIG.GUARDARIAN_KEY,
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const r = await axios(config);
    return r.data.redirect_url;
  } catch (error) {
    Logs.error(error);
    return null;
  }
};

export const buyFromRamp = (val, currency, coin, address) => {
  coin = coin.toUpperCase();
  if (coin === 'BNB') {
    coin = 'BSC_BNB';
  }
  const link =
    endpoints.ramper +
    '&hostApiKey=' +
    CONFIG.RAMP_KEY +
    '&userAddress=' +
    address +
    '&swapAsset=' +
    coin +
    '&fiatCurrency=USD&fiatValue=' +
    val;

  return link;
};

export const sellFromRamp = () => {
  // instance: null,
};
