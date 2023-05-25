/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {FC, useEffect} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import {useNavigation, CommonActions} from '@react-navigation/native';
import SS from 'react-native-splash-screen';
import * as RNLocalize from 'react-native-localize';
import {
  deleteUserPinCode,
  hasUserSetPinCode,
} from '@haskkor/react-native-pincode';
import {useTranslation} from 'react-i18next';
import {Colors} from 'utils/colors';
import {StorageGetItem} from 'services/storage';
import {MigrationService} from 'services/migrations';
import {ConfigStore} from 'stores/config';
import CONFIG from 'config';
import {Logs} from 'services/logs';
import StockService from 'services/stocks';
import {MarketStore} from 'stores/market';
import {COINS_MIN} from 'utils/constants';
import {initMixPanel} from 'utils/analytics';

const SplashScreen: FC = () => {
  const navigation = useNavigation();
  const {i18n} = useTranslation();

  useEffect(() => {
    ConfigStore.initializeConfig();
    check();
  }, []);

  const check = async () => {
    if (await MigrationService.migrationRequired()) {
      await MigrationService.handleMigrations();
      Logs.info('Migration completed');
    } else {
      Logs.info('Nothing to migrate');
    }
    const lng = await StorageGetItem('@lng', false);
    if (lng) {
      //@ts-ignore
      i18n.changeLanguage(lng);
    } else {
      const local = RNLocalize.getLocales();
      if (local.length > 0 && local[0].languageCode) {
        i18n.changeLanguage(local[0].languageCode);
      }
    }
    MarketStore.getTopCoins(COINS_MIN);
    StockService.getMarkets();
    await checkPin();
    SS.hide();
    initMixPanel();
  };

  const checkPin = async () => {
    const hasPin = await hasUserSetPinCode();
    const isInit = await StorageGetItem(CONFIG.INIT_KEY, false);
    CONFIG.navigation = navigation;
    if (hasPin && isInit) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'EnterPinScreen'}],
        }),
      );
    } else {
      await deleteUserPinCode();
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'OnBoardingScreen'}],
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={{height: 75, tintColor: '#353333'}}
        resizeMode="contain"
        source={require('../../assets/logo.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.splash,
  },
  logo: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 40,
    letterSpacing: 1,
  },
});

export default SplashScreen;
