/* eslint-disable no-undef */
import {AppState, Platform} from 'react-native';
import {BankStore} from 'stores/bankStore';
import {CexStore} from 'stores/cexStore';
import {FiatStore} from 'stores/fiatStore';
import {StockStore} from 'stores/StockStore';
import {WalletStore} from 'stores/wallet';
import {mixBalance} from 'utils/analytics';
import CONFIG from '../config';
import {Logs} from './logs';

class AppsStatesService {
  appStateSubscription: void;
  coldStart: boolean;
  constructor() {
    this.coldStart = true;
    let inBackground = false;
    let lastDate = Date.now();
    this.appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        try {
          if (nextAppState === 'active' && inBackground) {
            inBackground = false;
            if (Platform.OS === 'android') {
              const timeDiff = Date.now() - lastDate;
              if (timeDiff > CONFIG.PIN_ANDROID_TIMEOUT * 1000) {
                try {
                  CONFIG.navigation.navigate('ReEnterPinScreen');
                } catch (error) {
                  console.log(error);
                }
              }
            } else {
              try {
                CONFIG.navigation.navigate('ReEnterPinScreen');
              } catch (error) {
                console.log(error);
              }
            }
          } else if (nextAppState === 'background') {
            inBackground = true;
            lastDate = Date.now();
            try {
              mixBalance(
                Math.round(
                  WalletStore.totalBalance +
                    BankStore.totalBalance +
                    FiatStore.totalBalance +
                    CexStore.totalBalance +
                    StockStore.totalBalance,
                ),
              );
            } catch (error) {
              Logs.error(error);
            }
          }
        } catch (error) {
          inBackground = false;
          console.log(error);
        }
      },
    );
  }
}
//@ts-ignore
export default new AppsStatesService();
