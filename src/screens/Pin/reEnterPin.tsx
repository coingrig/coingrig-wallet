import React, {useEffect} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {StorageGetItem} from 'services/storage';
import CexService from 'services/cex';
import BanksService from 'services/banks';
import StockService from 'services/stocks';
import {STORED_MNEMONIC} from 'utils/constants';
import {clearAllAppData} from 'utils';
import CONFIG from '../../config';
import {CryptoService} from 'services/crypto';
import {Pincode} from '../../components/pincode';

const ReEnterPinScreen = () => {
  const navigation = useNavigation();
  let unlock = false;

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!unlock) {
          e.preventDefault();
          return;
        }
        navigation.dispatch(e.data.action);
        CryptoService.getAccountBalance();
        CexService.getAllBalances();
        BanksService.updateAccountsBalance();
        StockService.updateAllStocks();
      }),
    [navigation, unlock],
  );

  const success = async () => {
    const mnemonic = await StorageGetItem(STORED_MNEMONIC, true);
    if (mnemonic) {
      unlock = true;
      CONFIG.mnemonic = mnemonic;
      navigation.goBack();
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
      status={'enter'}
      onClickButtonLockedPage={() => console.log('Quit')}
    />
  );
};

export default ReEnterPinScreen;
