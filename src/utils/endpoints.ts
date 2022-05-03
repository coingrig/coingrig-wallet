import CONFIG from '../config';

let endpoints: any = {
  btc: 'https://www.blockchain.com/btc/',
  eth: 'https://etherscan.io/',
  bsc: 'https://bscscan.com/',
  polygon: 'https://polygonscan.com/',
};

if (CONFIG.TESTNET) {
  endpoints = {
    btc: 'https://www.blockchain.com/btc-testnet/',
    eth: 'https://ropsten.etherscan.io/',
    bsc: 'https://testnet.bscscan.com/',
    polygon: 'https://mumbai.polygonscan.com/',
  };
}
endpoints.nordigen = 'https://ob.nordigen.com/api/v2';
endpoints.bank_redirect = 'https://link.coingrig.com/closebrowser/';
endpoints.psd = 'https://api.coingrig.com/psd/';
endpoints.app = 'https://api.coingrig.com/app/';
endpoints.cryptoNews =
  'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';
endpoints.stockNews = 'https://api.coingrig.com/stocknews/';
endpoints.ramper =
  'https://buy.ramp.network/?hostAppName=Coingrig&variant=mobile';
endpoints.coingecko = 'https://api.coingecko.com/api/v3';
endpoints.covalent = 'https://api.covalenthq.com/v1';
endpoints.opensea = 'https://api.opensea.io/api/v1';
endpoints.fx = 'https://api.coingrig.com/fx/';
endpoints.assets = 'https://assets.coingrig.com';
endpoints.stocks = 'https://api.coingrig.com/stocks/';
endpoints.yahoofinance = 'https://finance.yahoo.com/quote/';
endpoints.googlefinance = 'https://www.google.com/finance/quote/';
endpoints.forms = {
  feedback: 'https://api.coingrig.com/forms/feedback',
};
export default endpoints;
