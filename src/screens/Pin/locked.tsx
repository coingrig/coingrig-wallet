import React, {useEffect} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {Pincode} from '../../components/pincode';

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
    <Pincode
      onFail={() => {
        showMessage({
          message: t('message.error.incorrect_pin'),
          type: 'warning',
        });
      }}
      onSuccess={() => success()}
      status={'choose'}
    />
  );
};

export default LockedScreen;
