import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// eslint-disable-next-line no-unused-vars
import AppsStateService from './src/services/appStates';
// eslint-disable-next-line no-unused-vars
import NotificationServices from './src/services/notifications';
// eslint-disable-next-line no-unused-vars
import DeepLinkService from './src/services/deeplink';
// eslint-disable-next-line no-unused-vars
import CexService from 'services/cex';
// eslint-disable-next-line no-unused-vars
import BanksService from 'services/banks';
// eslint-disable-next-line no-unused-vars
import FxService from 'services/fx';
// eslint-disable-next-line no-unused-vars
import StockService from 'services/stocks';
import {MenuProvider} from 'react-native-popup-menu';
import {NavigationScreens} from './src/routes';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LoadingSheet} from './src/components/loadingSheet';
import Door from './src/components/Door';
import FlashMessage from 'react-native-flash-message';
import {Colors} from './src/utils/colors';

function App() {
  try {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('black');
    }
  } catch (e) {}
  const CoingrigTheme = {
    colors: {
      background: Colors.background,
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={CoingrigTheme}>
        <MenuProvider>
          <NavigationScreens />
        </MenuProvider>
        <FlashMessage position="top" />
        <LoadingSheet />
        <Door />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default React.memo(App);
