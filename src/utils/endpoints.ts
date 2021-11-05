import CONFIG from '../config';

let endpoints: any = {
  btc: 'https://www.blockchain.com/btc/',
  eth: 'https://etherscan.io/',
};

if (CONFIG.TESTNET) {
  endpoints = {
    btc: 'https://www.blockchain.com/btc-testnet/',
    eth: 'https://ropsten.etherscan.io/',
  };
}

endpoints.app = 'https://api.coingrig.com/app/';

endpoints.news = 'https://api.coingrig.com/news/';

export default endpoints;
