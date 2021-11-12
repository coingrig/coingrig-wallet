import CONFIG from 'config';
import {Dimensions, ScaledSize} from 'react-native';
import {IWallet} from 'stores/wallet';

export const STORED_MNEMONIC: string = '@USER_MNEMONIC';
export const STORED_ACCOUNTS: string = '@USER_ACCOUNTS';
export const STORED_CHAIN_KEYS: string = '@CHAIN_KEYS';

export const ASSET_TYPE_COIN = 'coin';
export const ASSET_TYPE_TOKEN = 'token';
export const ASSET_TYPE_NFT = 'nft';

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
  // {
  //   symbol: 'BNB',
  //   name: 'Binance Smart Chain',
  //   chain: 'BSC',
  //   type: ASSET_TYPE_COIN,
  //   decimals: 18,
  //   contract: null,
  // },
  // {
  //   symbol: 'MATIC',
  //   name: 'Polygon (MATIC)',
  //   chain: 'POLYGON',
  //   type: ASSET_TYPE_COIN,
  //   decimals: 18,
  //   contract: null,
  // },
];
export const SIZE: ScaledSize = Dimensions.get('window');
export const COINS_MAX: number = 30;
export const COINS_MIN: number = 10;
