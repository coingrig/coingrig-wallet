/* eslint-disable no-undef */
import {AppState, Platform} from 'react-native';
import CONFIG from '../config';

class AppsStatesService {
  appStateSubscription: void;
  constructor() {
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
