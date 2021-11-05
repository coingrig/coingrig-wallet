import React, {useEffect} from 'react';
import PINCode from '@haskkor/react-native-pincode';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {StorageGetItem} from 'services/storage';
import {STORED_MNEMONIC} from 'utils/constants';
import {clearAllAppData} from 'utils';
import CONFIG from '../../config';
import {Colors} from 'utils/colors';
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
    <PINCode
      onFail={() => console.log('Fail to auth')}
      finishProcess={() => success()}
      status={'enter'}
      colorCircleButtons={Colors.darker}
      stylePinCodeDeleteButtonText={{color: Colors.foreground}}
      colorPassword={Colors.foreground}
      colorPasswordEmpty={Colors.foreground}
      numbersButtonOverlayColor={Colors.lighter}
      stylePinCodeColorSubtitle={Colors.foreground}
      stylePinCodeColorTitle={Colors.foreground}
      stylePinCodeDeleteButtonColorShowUnderlay={Colors.foreground}
      stylePinCodeDeleteButtonColorHideUnderlay={Colors.foreground}
      stylePinCodeButtonNumber={Colors.foreground}
      stylePinCodeTextButtonCircle={{fontWeight: '300'}}
      stylePinCodeTextSubtitle={{fontWeight: '300'}}
      stylePinCodeTextTitle={{fontWeight: '300'}}
      onClickButtonLockedPage={() => alert('Quit')}
      styleLockScreenButton={{transform: [{scale: 0}]}}
    />
  );
};

export default EnterPinScreen;
