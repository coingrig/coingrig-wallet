import CONFIG from 'config';
import {Dimensions, ScaledSize} from 'react-native';
import {IWallet} from 'stores/wallet';

export const STORED_MNEMONIC: string = '@USER_MNEMONIC';
export const STORED_ACCOUNTS: string = '@USER_ACCOUNTS';
export const STORED_CHAIN_KEYS: string = '@CHAIN_KEYS';

export const ASSET_TYPE_COIN = 'coin';
export const ASSET_TYPE_TOKEN = 'token';
export const ASSET_TYPE_NFT = 'nft';

export const ZEROX_FEE_PROXY = '0xdb6f1920a889355780af7570773609bd8cb1f498';

export const APPLE_UPDATE_LINK =
  'https://apps.apple.com/us/app/coingrig-crypto-btc-wallet/id1583464451';
export const GOOGLE_UPDATE_LINK =
  'https://play.google.com/store/apps/details?id=com.coingrig';

// symbol === chain
export const COIN_LIST: IWallet[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    cid: 'bitcoin',
    chain: 'BTC',
    type: ASSET_TYPE_COIN,
    decimals: 8,
    contract: null,
    privKey: null,
    walletAddress: null,
    balance: 0,
    unconfirmedBalance: 0,
    value: 0,
    price: 0,
    active: true,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    version: CONFIG.NEW_ASSET_DESCRIPTOR_VERSION,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    cid: 'ethereum',
    chain: 'ETH',
    type: ASSET_TYPE_COIN,
    decimals: 18,
    contract: null,
    privKey: null,
    walletAddress: null,
    balance: 0,
    unconfirmedBalance: 0,
    value: 0,
    price: 0,
    active: true,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    version: CONFIG.NEW_ASSET_DESCRIPTOR_VERSION,
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    cid: 'binancecoin',
    chain: 'BSC',
    type: ASSET_TYPE_COIN,
    decimals: 18,
    contract: null,
    privKey: null,
    walletAddress: null,
    balance: 0,
    unconfirmedBalance: 0,
    value: 0,
    price: 0,
    active: true,
    image:
      'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
    version: CONFIG.NEW_ASSET_DESCRIPTOR_VERSION,
  },
  {
    symbol: 'MATIC',
    name: 'Matic',
    cid: 'matic-network',
    chain: 'POLYGON',
    type: ASSET_TYPE_COIN,
    decimals: 18,
    contract: null,
    privKey: null,
    walletAddress: null,
    balance: 0,
    unconfirmedBalance: 0,
    value: 0,
    price: 0,
    active: true,
    image:
      'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    version: CONFIG.NEW_ASSET_DESCRIPTOR_VERSION,
  },
];
export const SIZE: ScaledSize = Dimensions.get('window');
export const COINS_MAX: number = 30;
export const COINS_MIN: number = 10;
export const UA: string =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_5_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36';

export const SYNTH_LIST = [
  {
    cid: 'mirrored-tesla',
    title: 'Tesla',
    img: 'https://assets.coingrig.com/images/synth/tesla.png',
  },
  {
    cid: 'mirrored-google',
    title: 'Google',
    img: 'https://assets.coingrig.com/images/synth/google.png',
  },
  {
    cid: 'mirrored-microsoft',
    title: 'Microsoft',
    img: 'https://assets.coingrig.com/images/synth/microsoft.png',
  },
  {
    cid: 'mirrored-apple',
    title: 'Apple',
    img: 'https://assets.coingrig.com/images/synth/apple.png',
  },
  {
    cid: 'mirrored-ishares-silver-trust',
    title: 'iShares Silver',
    img: 'https://assets.coingrig.com/images/synth/silver.png',
  },
  {
    cid: 'mirrored-amazon',
    title: 'Amazon',
    img: 'https://assets.coingrig.com/images/synth/amazon.png',
  },
  {
    cid: 'mirrored-netflix',
    title: 'Netflix',
    img: 'https://assets.coingrig.com/images/synth/netflix.png',
  },
  {
    cid: 'mirrored-united-states-oil-fund',
    title: 'US OIL Fund',
    img: 'https://assets.coingrig.com/images/synth/oil.png',
  },
  {
    cid: 'mirrored-twitter',
    title: 'Twitter',
    img: 'https://assets.coingrig.com/images/synth/twitter.png',
  },
  {
    cid: 'mirrored-alibaba',
    title: 'Alibaba',
    img: 'https://assets.coingrig.com/images/synth/alibaba.png',
  },
  {
    cid: 'mirrored-ishares-gold-trust',
    title: 'iShares Gold',
    img: 'https://assets.coingrig.com/images/synth/gold.png',
  },
  {
    cid: 'mirrored-facebook',
    title: 'Facebook',
    img: 'https://assets.coingrig.com/images/synth/fb.png',
  },
  {
    cid: 'mirrored-invesco-qqq-trust',
    title: 'Invesco QQQ',
    img: 'https://assets.coingrig.com/images/synth/q.png',
  },
];
