import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// eslint-disable-next-line no-unused-vars
import AppsStateService from './src/services/appStates';
// eslint-disable-next-line no-unused-vars
import DeepLinkService from './src/services/deeplink';
import {MenuProvider} from 'react-native-popup-menu';
import {NavigationScreens} from './src/router/router';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LoadingSheet} from './src/components/loadingSheet';
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
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default React.memo(App);
