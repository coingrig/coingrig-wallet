/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, createRef} from 'react';
import {Text, View, ScrollView, Image, ActivityIndicator} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {useTranslation} from 'react-i18next';
import {styles} from './styles';
import {Colors} from 'utils/colors';
import {observer} from 'mobx-react-lite';
import {showMessage} from 'react-native-flash-message';
import {
  WalletConnectService,
  WALLETCONNECT_STATUS,
} from '../../services/walletconnect';
import {WalletconnectStore} from '../../stores/walletconnect';
import {CryptoService} from 'services/crypto';
import {WalletStore} from 'stores/wallet';
import {WalletFactory} from '@coingrig/core';
import {Fees} from '@coingrig/core';
import {SmallButton} from 'components/smallButton';
import FastImage from 'react-native-fast-image';
import {Logs} from 'services/logs';

const actionCamera: React.RefObject<any> = createRef();

const WalletconnectScreen = observer(() => {
  const {t} = useTranslation();

  useEffect((): any => {
    return WalletConnectService.closeSession;
  }, []);

  const onSuccess = e => {
    Logs.info(e.data);
    let uri = e.data;
    const data: any = {uri};
    data.redirect = '';
    data.autosign = false;
    if (!WalletConnectService.init(data)) {
      // Display error message
    }
    actionCamera.current?.setModalVisible(false);
  };

  const disconnectedRender = () => {
    return (
      <View style={styles.content}>
        <Image
          source={require('../../assets/wc.png')}
          resizeMode="contain"
          style={styles.wclogo}
        />
        <SmallButton
          text={t('walletconnect.scan_qr_code')}
          onPress={() => actionCamera.current?.setModalVisible()}
          color={Colors.foreground}
          style={[
            styles.smallBtn,
            {
              backgroundColor: Colors.darker,
              borderWidth: 1,
              borderColor: Colors.lighter,
            },
          ]}
        />
      </View>
    );
  };

  const connectingRender = () => {
    return (
      <View style={styles.content}>
        <Image
          source={require('../../assets/wc.png')}
          resizeMode="contain"
          style={styles.wclogo}
        />
        <ActivityIndicator
          size="small"
          color={Colors.foreground}
          style={{marginBottom: 20}}
        />
      </View>
    );
  };

  const renderPeerMeta = () => {
    if (WalletconnectStore.status === WALLETCONNECT_STATUS.CONNECTING) {
      return connectingRender();
    }
    if (WalletconnectStore.status === WALLETCONNECT_STATUS.DISCONNECTED) {
      return disconnectedRender();
    }
    if (!WalletconnectStore.peerMeta) {
      return null;
    }
    return (
      <View style={styles.content}>
        <FastImage
          source={{
            uri: WalletconnectStore.peerMeta.icons[0],
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode="contain"
          style={styles.peerIcon}
        />
        {WalletconnectStore.status !== WALLETCONNECT_STATUS.SESSION_REQUEST ? (
          <View style={styles.connected}>
            <Text style={styles.connectedTxt}>
              {t('walletconnect.connected')}
              {' - Network: '}
              {CryptoService.CHAIN_ID_TYPE_MAP[WalletconnectStore.chainId]}
            </Text>
          </View>
        ) : null}
        <Text style={styles.subtitle}>{WalletconnectStore.peerMeta.name}</Text>
        {renderActionRequest()}
        {renderAuthRequest()}
      </View>
    );
  };

  const acceptRequest = async (method: any) => {
    try {
      // Get the coresponding wallet for the chain
      let chainType =
        CryptoService.CHAIN_ID_TYPE_MAP[WalletconnectStore.chainId];
      // Get the coin descriptor for the chain native asset
      let cryptoWalletDescriptor = WalletStore.getWalletByCoinId(
        CryptoService.getChainNativeAsset(chainType),
        chainType,
      );
      // Get the chain private key for signature
      let chainKeys = await CryptoService.getChainPrivateKeys();
      let chainAddress = WalletStore.getWalletAddressByChain(chainType);
      // Build the crypto wallet to send the transaction with
      let cryptoWallet = WalletFactory.getWallet(
        Object.assign({}, cryptoWalletDescriptor, {
          walletAddress: chainAddress,
          privKey: chainKeys.ETH,
        }),
      );
      if (!cryptoWallet) {
        WalletConnectService.rejectRequest({
          id: WalletconnectStore.transactionData.id!,
          error: 'This chain is not supported',
        });
      }
      let signingManager = cryptoWallet.getSigningManager();
      if (!signingManager) {
        WalletConnectService.rejectRequest({
          id: WalletconnectStore.transactionData.id!,
          error: 'This chain can not be signed',
        });
        return;
      }
      // Build and send the transaction proposal
      let result: any = '';

      if (method === WALLETCONNECT_STATUS.SIGN_TRANSACTION) {
        let params = WalletconnectStore.transactionData.params[0]!;
        let tx = await signingManager.signTransaction(params);
        result = tx;
      }

      if (method === WALLETCONNECT_STATUS.SEND_TRANSACTION) {
        let params = WalletconnectStore.transactionData.params[0]!;
        let tx = await signingManager.signTransaction(params);
        result = await cryptoWallet.postRawTxSend(tx);
      }

      if (method === WALLETCONNECT_STATUS.SIGN_TYPED_DATA) {
        let params = WalletconnectStore.transactionData.params[1]!;
        result = await signingManager.signTypedData(params);
      }

      WalletConnectService.approveRequest({
        id: WalletconnectStore.transactionData.id!,
        result: result,
      });
    } catch (e: any) {
      Logs.error(e);
      WalletConnectService.rejectRequest({
        id: WalletconnectStore.transactionData.id!,
        error: e?.message,
      });
    }
  };

  const renderActionRequest = () => {
    if (
      WalletconnectStore.status === WALLETCONNECT_STATUS.SEND_TRANSACTION ||
      WalletconnectStore.status === WALLETCONNECT_STATUS.SIGN_TRANSACTION ||
      WalletconnectStore.status === WALLETCONNECT_STATUS.SIGN_TYPED_DATA
    ) {
      return (
        <View style={{marginTop: 40}}>
          <SmallButton
            text={t('walletconnect.approve')}
            onPress={async () => acceptRequest(WalletconnectStore.status)}
            color={Colors.darker}
            style={styles.smallBtn}
          />
          <View style={{height: 10}} />
          <SmallButton
            text={t('walletconnect.reject')}
            onPress={() =>
              WalletConnectService.rejectRequest({
                id: WalletconnectStore.transactionData.id!,
                error: '',
              })
            }
            color={Colors.foreground}
            style={[styles.smallBtn, {backgroundColor: Colors.darker}]}
          />
        </View>
      );
    }
    return null;
  };

  const renderAuthRequest = () => {
    if (WalletconnectStore.status !== WALLETCONNECT_STATUS.SESSION_REQUEST) {
      return null;
    }
    // if chain not supported display warning and CLOSE button
    let chainType = CryptoService.CHAIN_ID_TYPE_MAP[WalletconnectStore.chainId];
    if (!chainType) {
      WalletConnectService.rejectSession();
      showMessage({
        message: t('walletconnect.wrong_chain'),
        type: 'warning',
      });
      return;
    }
    return (
      <View style={{marginTop: 20}}>
        <SmallButton
          text={t('walletconnect.accept')}
          onPress={() => {
            // Get the coresponding wallet for the chain
            WalletConnectService.acceptSession(
              WalletconnectStore.chainId,
              WalletStore.getWalletAddressByChain(chainType),
            );
          }}
          color={Colors.darker}
          style={styles.smallBtn}
        />
        <SmallButton
          text={t('walletconnect.reject')}
          onPress={() => WalletConnectService.rejectSession()}
          color={Colors.foreground}
          style={[styles.smallBtn, {backgroundColor: Colors.darker}]}
        />
      </View>
    );
  };

  const renderDisconnect = () => {
    if (WalletconnectStore.status !== WALLETCONNECT_STATUS.CONNECTED) {
      return null;
    }
    return (
      <View style={styles.disconnect}>
        <SmallButton
          text={t('walletconnect.disconnect')}
          onPress={() => WalletConnectService.closeSession()}
          color={Colors.foreground}
          style={[styles.smallBtn, {backgroundColor: Colors.darker}]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        {renderPeerMeta()}
        {renderDisconnect()}
      </ScrollView>
      <ActionSheet
        //@ts-ignore
        ref={actionCamera}
        gestureEnabled={true}
        headerAlwaysVisible
        containerStyle={styles.cameracontainer}>
        <QRCodeScanner
          onRead={onSuccess}
          //@ts-ignore
          cameraContainerStyle={{margin: 20}}
          flashMode={RNCamera.Constants.FlashMode.auto}
        />
      </ActionSheet>
    </View>
  );
});

export default WalletconnectScreen;
