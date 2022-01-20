import React, {useEffect} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {StorageGetItem} from 'services/storage';
import {STORED_MNEMONIC} from 'utils/constants';
import {clearAllAppData} from 'utils';
import CONFIG from '../../config';
import {Pincode} from '../../components/pincode';

const EnterPinScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // getExchangeRates();
  }, []);

  const success = async () => {
    const mnemonic = await StorageGetItem(STORED_MNEMONIC, true);
    if (mnemonic) {
      CONFIG.mnemonic = mnemonic;
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'HomeScreens'}],
        }),
      );
    } else {
      await clearAllAppData();
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'SplashScreen'}],
        }),
      );
    }
  };

  return (
    <Pincode
      onFail={() => {
        console.log('Fail to auth');
      }}
      onSuccess={() => success()}
      onClickButtonLockedPage={() => console.log('Quit')}
      status={'enter'}
    />
  );
};

export default EnterPinScreen;
