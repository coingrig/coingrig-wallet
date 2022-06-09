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
    console.log(r.data);
    return r.data.redirect_url;
  } catch (error) {
    Logs.error(error);
    return null;
  }
};

export const sellFromGuardarian = () => {
  // instance: null,
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

  console.log(link);
  return link;
};

export const sellFromRamp = () => {
  // instance: null,
};

// var axios = require("axios");
// var data = JSON.stringify({
//   from_amount: 1,
//   from_currency: "ETH",
//   to_currency: "USD",
//   from_network: "ETH",
// });

// var config = {
//   method: "post",
//   url: "https://api-payments.guardarian.com/v1/transaction",
//   headers: {
//     accept: "*/*",
//     "x-api-key": "19a1cd64-7d28-4702-8386-b4fad179ef2c",
//     "Content-Type": "application/json",
//   },
//   data: data,
// };

// axios(config)
//   .then(function (response) {
//     console.log(JSON.stringify(response.data));
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

// var axios = require("axios");
// var data = JSON.stringify({
//   from_amount: 100,
//   from_currency: "EUR",
//   to_currency: "ETH",
//   to_network: "ETH",
//   payout_address: "0x34277D9b97451a36dBb806E2B7F50fc877B0B726",
// });

// var config = {
//   method: "post",
//   url: "https://api-payments.guardarian.com/v1/transaction",
//   headers: {
//     accept: "*/*",
//     "x-api-key": "19a1cd64-7d28-4702-8386-b4fad179ef2c",
//     "Content-Type": "application/json",
//   },
//   data: data,
// };

// axios(config)
//   .then(function (response) {
//     console.log(JSON.stringify(response.data));
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
