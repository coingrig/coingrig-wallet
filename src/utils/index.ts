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
  if (newNr === '$NaN' || newNr === '$0') {
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

export const convertExponential = (n: string | number) => {
  var sign = +n < 0 ? '-' : '',
    toStr = n.toString();
  if (!/e/i.test(toStr)) {
    return n;
  }
  var [lead, decimal, pow] = n
    .toString()
    .replace(/^-/, '')
    .replace(/^([0-9]+)(e.*)/, '$1.$2')
    .split(/e|\./);
  return +pow < 0
    ? sign +
        '0.' +
        '0'.repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
        lead +
        decimal
    : sign +
        lead +
        (+pow >= decimal.length
          ? decimal + '0'.repeat(Math.max(+pow - decimal.length || 0, 0))
          : decimal.slice(0, +pow) + '.' + decimal.slice(+pow));
};

export const capitalizeFirstLetter = string => {
  const newString = string.toLowerCase();
  return newString.charAt(0).toUpperCase() + newString.slice(1);
};
