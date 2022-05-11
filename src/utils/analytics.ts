/* eslint-disable no-shadow */
import Analytics from 'appcenter-analytics';
import {Logs} from 'services/logs';
import {Mixpanel} from 'mixpanel-react-native';
import DeviceInfo from 'react-native-device-info';
import CONFIG from 'config';
// import {StorageGetItem} from 'services/storage';

export enum ILogEvents {
  APP_START = 'AppStart',
  SCREEN = 'Screen',
  CLICK = 'Click',
  ACTION = 'Action',
  BALANCE = 'Balance',
}

let mixpanel: any = null;

export const initMixPanel = async () => {
  if (!mixpanel) {
    mixpanel = new Mixpanel(CONFIG.MIXPANEL_KEY);
    mixpanel.init();
    // const isInit = await StorageGetItem('@init', false);
    const DID = DeviceInfo.getUniqueId();
    mixpanel.identify(DID);
    mixpanel.getPeople().set({$name: DID});
    // if (!isInit) {
    //   mixpanel.identify(DID);
    //   mixpanel.getPeople().set({$name: DID});
    // }
  }
};

export const updateProfile = (balance: number) => {
  mixpanel.getPeople().set(ILogEvents.BALANCE, balance);
};

export const mixBalance = (balance: number) => {
  mixpanel.getPeople().set(ILogEvents.BALANCE, balance);
};

export const LogEvents = async (type: ILogEvents, name: string) => {
  await initMixPanel();
  try {
    if (__DEV__) {
      Analytics.trackEvent('DEV-' + type, {name: name});
      mixpanel.track(type, {name: name});
      Logs.debug('Analytics: DEV-' + type, {name: name});
    } else {
      Analytics.trackEvent(type, {name: name});
      mixpanel.track(type, {name: name});
    }
  } catch (error) {
    Logs.error(error);
  }
};
