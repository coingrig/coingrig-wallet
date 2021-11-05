import {deleteUserPinCode} from '@haskkor/react-native-pincode';
import {StorageClearAll} from 'services/storage';
import {clearPersistedStore} from 'mobx-persist-store';
import RNRestart from 'react-native-restart';
import i18next from 'i18next';

export const clearAllAppData = async () => {
  await clearPersistedStore('MarketStore');
  await clearPersistedStore('WalletStore');
  await clearPersistedStore('SettingsStore');
  await StorageClearAll();
  await deleteUserPinCode();
  RNRestart.Restart();
};

export const formatPrice = nr => {
  let newNr = i18next.format(nr, '$0,0[.][00]');
  if (newNr === '$0') {
    newNr = '$' + nr;
  }
  return newNr;
};

export const formatNumber = nr => {
  return i18next.format(nr, '0,0.[00]a');
};

export const formatCoins = nr => {
  return Number(nr.toPrecision(4));
};

export const formatFee = nr => {
  return i18next.format(nr, '$0,0[.][00]');
};

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const formatNoComma = (nr: string) => {
  return parseFloat(nr.replace(/,/g, '.'));
};
