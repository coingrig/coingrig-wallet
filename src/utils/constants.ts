import {Dimensions, ScaledSize} from 'react-native';

export const STORED_MNEMONIC: string = '@USER_MNEMONIC';
export const STORED_ACCOUNTS: string = '@USER_ACCOUNTS';
export const STORED_CHAIN_KEYS: string = '@CHAIN_KEYS';

export const ASSET_TYPE_COIN = 'coin';
export const ASSET_TYPE_TOKEN = 'token';
export const ASSET_TYPE_NFT = 'nft';

export const COIN_LIST: any[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    chain: 'BTC',
    type: ASSET_TYPE_COIN,
    decimals: 8,
    contract: null,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    chain: 'ETH',
    type: ASSET_TYPE_COIN,
    decimals: 18,
    contract: null,
  },
];
export const SIZE: ScaledSize = Dimensions.get('window');
export const COINS_MAX: number = 30;
export const COINS_MIN: number = 10;
