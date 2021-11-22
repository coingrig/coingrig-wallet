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

endpoints.app = 'https://api.coingrig.com/app/';
endpoints.news = 'https://api.coingrig.com/news/';
endpoints.ramper =
  'https://buy.ramp.network/?hostAppName=Coingrig&variant=mobile';
endpoints.coingecko = 'https://api.coingecko.com/api/v3';
endpoints.covalent = 'https://api.covalenthq.com/v1';

export default endpoints;
