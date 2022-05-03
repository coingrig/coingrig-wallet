import {deleteUserPinCode} from '@haskkor/react-native-pincode';
import {StorageClearAll} from 'services/storage';
import {clearPersistedStore} from 'mobx-persist-store';
import RNRestart from 'react-native-restart';
import i18next from 'i18next';
import BigNumber from 'bignumber.js';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Linking} from 'react-native';
import {Logs} from 'services/logs';

export const clearAllAppData = async () => {
  await clearPersistedStore('MarketStore');
  await clearPersistedStore('WalletStore');
  await clearPersistedStore('SettingsStore');
  await clearPersistedStore('CexStore');
  await clearPersistedStore('BankStore');
  await clearPersistedStore('FiatStore');
  await clearPersistedStore('StockStore');
  await clearPersistedStore('FxStore');
  await StorageClearAll();
  await deleteUserPinCode();
  RNRestart.Restart();
};

export const formatPrice = (nr, limitDigits = false) => {
  if (nr === 0 || isNaN(nr)) {
    return '$0';
  }
  if (limitDigits) {
    const bgn = new BigNumber(nr);
    if (bgn.isLessThan(new BigNumber(1e-2))) {
      return '\u2248 $0.00'; // ≈ unicode
    }
  }
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
  if (isNaN(nr)) {
    return '-';
  }
  const newNr = new BigNumber(nr);
  return Number(newNr.toFixed(4));
};

export const formatFee = nr => {
  return i18next.format(nr, '$0,0[.][00]');
};

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const formatNoComma = (nr: string) => {
  return nr.replace(/,/g, '.');
};

export const convertExponential = (n: string | number) => {
  const newNr = new BigNumber(n);
  return newNr.toFixed(9);
};

export const capitalizeFirstLetter = string => {
  const newString = string.toLowerCase();
  return newString.charAt(0).toUpperCase() + newString.slice(1);
};

export const toWei = (amount, decimals) => {
  return Number(new BigNumber(amount).multipliedBy(10 ** decimals!));
};

export const toEth = (amount, decimals) => {
  return String(new BigNumber(amount).div(10 ** decimals!));
};

export const calcFee = (gas, gasPrice) => {
  return Number(new BigNumber(gas).multipliedBy(gasPrice));
};

export const openLink = async url => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        dismissButtonStyle: 'cancel',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'automatic',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        showTitle: true,
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
      });
    } else {
      await Linking.openURL(url);
    }
  } catch (error) {
    Logs.error(error);
  }
};

export const formatTime = UNIX_timestamp => {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
};

export const getChainByCoin = coin => {
  switch (coin) {
    case 'ETH':
      return 'ETH';
    case 'BNB':
      return 'BSC';
    case 'MATIC':
      return 'POLYGON';
    case 'BTC':
      return 'BTC';
    default:
      return null;
  }
};
