/* eslint-disable react-hooks/exhaustive-deps */
import React, {FC, useEffect} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import {useNavigation, CommonActions} from '@react-navigation/native';
import SS from 'react-native-splash-screen';
import {
  deleteUserPinCode,
  hasUserSetPinCode,
} from '@haskkor/react-native-pincode';
import {Colors} from 'utils/colors';
import {StorageGetItem} from 'services/storage';
import {ConfigStore} from 'stores/config';
import CONFIG from 'config';

const SplashScreen: FC = () => {
  const navigation = useNavigation();

  ConfigStore.initializeConfig();

  useEffect(() => {
    checkPin();
    SS.hide();
  }, []);

  const checkPin = async () => {
    let hasPin = await hasUserSetPinCode();
    let isInit = await StorageGetItem('@init', false);
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
        style={{height: 100, tintColor: Colors.foreground}}
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
  },
  logo: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 40,
    letterSpacing: 1,
  },
});

export default SplashScreen;
