/* eslint-disable no-shadow */
import Analytics from 'appcenter-analytics';
import {Logs} from 'services/logs';

export enum ILogEvents {
  APP_START = 'AppStart',
  SCREEN = 'Screen',
  CLICK = 'Click',
  ACTION = 'Action',
}

export const LogEvents = (type: ILogEvents, name: string) => {
  try {
    if (__DEV__) {
      Analytics.trackEvent('DEV-' + type, {name: name});
      Logs.debug('Analytics: DEV-' + type, {name: name});
    } else {
      Analytics.trackEvent(type, {name: name});
    }
  } catch (error) {
    Logs.error(error);
  }
};
