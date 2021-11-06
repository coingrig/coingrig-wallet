/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, createRef, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {useTranslation} from 'react-i18next';
import {BigButton} from 'components/bigButton';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import ActionSheet from 'react-native-actions-sheet';
import {showMessage} from 'react-native-flash-message';
import {formatNoComma, formatPrice, sleep} from 'utils';
import Clipboard from '@react-native-clipboard/clipboard';
import {WalletStore} from 'stores/wallet';
import {SmallButton} from '../smallButton';
import {Colors} from 'utils/colors';
import {LoadingModal} from 'services/loading';
import {WalletFactory} from '@coingrig/core';
import {CryptoService} from 'services/crypto';
import {styles} from './styles';

const actionSheetRef = createRef();
const actionCamera = createRef();

export function SendContainer(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [destination, setDestination] = useState<string>('');
  const [value, setValue] = useState();
  const [wallet, setWallet] = useState<any>();
  const [fees, setFees] = useState<any>();
  const [feeFiat, setFeeFiat] = useState<any>(0);
  const [toFiat, setToFiat] = useState<string>('$0');
  const [keyboardEnabled, setKeyboardEnabled] = useState(false);

  useEffect(() => {
    setupWallet();
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardEnabled(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardEnabled(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const setupWallet = async () => {
    let chainKeys = await CryptoService.getChainPrivateKeys();
    let descriptor = Object.assign({}, props.coinDescriptor, {
      privKey: chainKeys[props.coinDescriptor.chain],
      walletAddress: WalletStore.getWalletAddressByChain(
        props.coinDescriptor.chain,
      ),
    });
    const _wallet = WalletFactory.getWallet(descriptor);
    setWallet(_wallet);
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setDestination(text);
  };

  const onSuccess = e => {
    // alert(e.data);
    setDestination(e.data);
    //@ts-ignore
    actionCamera.current?.setModalVisible(false);
  };

  const prepareTx = async () => {
    Keyboard.dismiss();
    if (!value || !destination) {
      Alert.alert('Error', 'Please fill up the form');
      return;
    }
    //@ts-ignore
    const amountToSend = formatNoComma(value.toString());
    //@ts-ignore
    setValue(amountToSend.toString());
    await sleep(500);
    //@ts-ignore
    LoadingModal.instance.current?.show();
    await sleep(200);
    try {
      const _fees = await wallet.getTxSendProposals(destination, amountToSend);
      if (!_fees || Object.keys(_fees).length === 0) {
        showMessage({
          message: t('message.error.amount_to_send_too_large'),
          type: 'danger',
        });
        //@ts-ignore
        LoadingModal.instance.current?.hide();
        return;
      }
      let fFiat =
        _fees.regular.getFeeValue() *
        WalletStore.getWalletByCoinId(props.coin)?.price!;
      setFeeFiat(fFiat);
      setFees(_fees);
      //@ts-ignore
      LoadingModal.instance.current?.hide();
      await sleep(300);
      //@ts-ignore
      actionSheetRef.current?.setModalVisible();
    } catch (error) {
      console.log(error);
      //@ts-ignore
      LoadingModal.instance.current?.hide();
      showMessage({
        message: t('message.error.remote_servers_not_available'),
        type: 'warning',
      });
    }
  };

  const setAmount = v => {
    setValue(v);
    const formattedValue = formatNoComma(v);
    const fiatValue = !formattedValue
      ? 0
      : WalletStore.getWalletByCoinId(props.coin)?.price! * formattedValue;
    setToFiat(formatPrice(fiatValue));
  };

  const openLink = async url => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'automatic',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const executeTX = async () => {
    //@ts-ignore
    actionSheetRef.current?.setModalVisible(false);
    await sleep(200);
    //@ts-ignore
    LoadingModal.instance.current?.show();
    await sleep(200);
    try {
      let tx = await wallet.postTxSend(fees.regular);
      //@ts-ignore
      LoadingModal.instance.current?.hide();
      if (tx) {
        showMessage({
          message: t('message.transaction_done'),
          type: 'success',
          duration: 5000,
          onPress: () => {
            openLink(CryptoService.getTxExplorer(props.coin, tx));
          },
        });
      } else {
        showMessage({
          message: t('message.error.transaction_can_not_be_executed'),
          type: 'warning',
        });
      }
      navigation.goBack();
    } catch (error) {
      console.log(error);
      // Alert.alert('Transaction error', 'Transaction cannot be executed !');
      showMessage({
        message: t('message.error.transaction_can_not_be_executed'),
        type: 'danger',
      });
    }
  };

  return (
    <View style={[styles.maincontainer, {flex: keyboardEnabled ? 0 : 1}]}>
      <View style={styles.container}>
        <View style={{marginBottom: 5}}>
          <View style={styles.input}>
            <TextInput
              style={{flex: 1, color: Colors.foreground}}
              onChangeText={v => setDestination(v)}
              value={destination}
              placeholder={t('tx.destination_address')}
              numberOfLines={1}
              returnKeyType="done"
              placeholderTextColor="gray"
              autoCompleteType={'off'}
              autoCapitalize={'none'}
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => fetchCopiedText()}
              style={styles.moreBtn}>
              <Icon name="content-paste" size={20} color={Colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity
              //@ts-ignore
              onPress={() => actionCamera.current?.setModalVisible()}
              style={styles.moreBtn2}>
              <Icon name="qr-code" size={21} color={Colors.foreground} />
            </TouchableOpacity>
          </View>

          <View style={styles.input}>
            <TextInput
              style={{flex: 1, color: Colors.foreground}}
              onChangeText={v => setAmount(v)}
              value={value}
              placeholder={props.coin + ' ' + t('tx.amount')}
              keyboardType="numeric"
              numberOfLines={1}
              returnKeyType="done"
              placeholderTextColor="gray"
            />
            <View style={styles.moreBtn2}>
              <Text style={{color: Colors.foreground}}>{props.coin}</Text>
            </View>
          </View>
          <Text style={styles.toFiat}>{toFiat}</Text>
        </View>
      </View>
      <View style={styles.preparetx}>
        <BigButton
          text={t('tx.next')}
          backgroundColor={Colors.foreground}
          color={Colors.background}
          disabled={false}
          onPress={() => prepareTx()}
        />
      </View>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        headerAlwaysVisible
        containerStyle={{flex: 1}}>
        <View>
          <Text style={styles.confirmtx}>{t('tx.confirm_tx')}</Text>
          <View style={styles.amountusd}>
            <Text style={{marginBottom: 5}}>
              {t('tx.amount_in_usd')}:{' '}
              {formatPrice(
                value! * WalletStore.getWalletByCoinId(props.coin)?.price!,
              )}
            </Text>
            <Text>
              {t('tx.miner_fee')}: {formatPrice(feeFiat)}
            </Text>
            <Text style={styles.totalusd}>
              {t('tx.total_usd')}:{' '}
              {formatPrice(
                value! * WalletStore.getWalletByCoinId(props.coin)?.price! +
                  feeFiat,
              )}
            </Text>
          </View>
        </View>
        <SmallButton
          text={t('tx.confirm')}
          onPress={() => executeTX()}
          style={styles.exectx}
          color="white"
        />
      </ActionSheet>
      <ActionSheet
        ref={actionCamera}
        gestureEnabled={true}
        headerAlwaysVisible
        containerStyle={styles.cameracontainer}>
        <QRCodeScanner
          onRead={onSuccess}
          cameraContainerStyle={{margin: 20}}
          flashMode={RNCamera.Constants.FlashMode.auto}
        />
      </ActionSheet>
    </View>
  );
}
