import React, {useEffect} from 'react';
import PINCode from '@haskkor/react-native-pincode';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {Colors} from 'utils/colors';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';

const LockedScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  useEffect(() => {}, []);

  const success = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'GenerateWalletScreen'}],
      }),
    );
  };

  return (
    <PINCode
      onFail={() => {
        showMessage({
          message: t('message.error.incorrect_pin'),
          type: 'warning',
        });
      }}
      finishProcess={() => success()}
      status={'choose'}
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
    />
  );
};

export default LockedScreen;
