/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, createRef} from 'react';
import {Text, View, ScrollView, Image, ActivityIndicator} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as Animatable from 'react-native-animatable';
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
import {SmallButton} from 'components/smallButton';
import FastImage from 'react-native-fast-image';
import {Logs} from 'services/logs';
import {BigButton} from 'components/bigButton';
import {ILogEvents, LogEvents} from 'utils/analytics';

const actionCamera: React.RefObject<any> = createRef();

const WalletconnectScreen = observer(({route}) => {
  const {t} = useTranslation();

  useEffect((): any => {
    if (route.params && route.params.uri) {
      let uri = route.params.uri;
      uri = decodeURIComponent(uri);
      const data: any = {uri};
      data.redirect = '';
      data.autosign = false;
      if (!WalletConnectService.init(data)) {
        // Display error message
      }
    }
    LogEvents(ILogEvents.SCREEN, 'WalletConnect');
    return WalletConnectService.closeSession;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSuccess = e => {
    const uri = e.data;
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
      <View style={styles.scanContainer}>
        <Animatable.View
          animation="zoomIn"
          delay={100}
          style={{
            padding: 100,
            backgroundColor: Colors.darker,
            borderRadius: 300,
            justifyContent: 'center',
            marginTop: '10%',
          }}>
          <View
            style={{
              padding: 50,
              backgroundColor: Colors.background,
              borderRadius: 200,
            }}>
            <Image
              source={require('../../assets/wc.png')}
              resizeMode="contain"
              style={styles.wclogo}
            />
          </View>
        </Animatable.View>
        <View style={{marginBottom: 30}}>
          <Text
            style={{
              fontSize: 12,
              marginHorizontal: 40,
              textAlign: 'center',
              marginBottom: 20,
              color: Colors.lighter,
            }}>
            {t('walletconnect.disclaimer')}
          </Text>
          <BigButton
            text={t('walletconnect.scan_qr_code')}
            backgroundColor={Colors.foreground}
            color={Colors.background}
            onPress={() => actionCamera.current?.setModalVisible()}
          />
        </View>
      </View>
    );
  };

  const connectingRender = () => {
    return (
      <View style={styles.scanContainer}>
        <Animatable.View
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          style={{
            padding: 100,
            backgroundColor: Colors.darker,
            borderRadius: 300,
            justifyContent: 'center',
            marginTop: '10%',
          }}>
          <View
            style={{
              padding: 50,
              backgroundColor: Colors.background,
              borderRadius: 200,
            }}>
            <Image
              source={require('../../assets/wc.png')}
              resizeMode="contain"
              style={styles.wclogo}
            />
          </View>
        </Animatable.View>
        <View style={{marginBottom: 30}}>
          <ActivityIndicator
            size="large"
            color={Colors.foreground}
            style={{marginBottom: 30}}
          />
        </View>
      </View>
    );
  };

  const showTxDetails = () => {
    return (
      <View style={{marginHorizontal: 15}}>
        <Text
          numberOfLines={3}
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: Colors.lighter,
            marginHorizontal: 20,
          }}>
          {WalletconnectStore.peerMeta.description}
        </Text>
        <Text
          numberOfLines={3}
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: Colors.lighter,
            marginHorizontal: 20,
            marginTop: 10,
            fontWeight: 'bold',
          }}>
          {WalletconnectStore.peerMeta.url}
        </Text>
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
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <FastImage
            source={{
              uri: WalletconnectStore.peerMeta.icons[0],
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode="contain"
            style={styles.peerIcon}
          />
          {WalletconnectStore.status !==
          WALLETCONNECT_STATUS.SESSION_REQUEST ? (
            <View style={styles.connected}>
              <Text style={styles.connectedTxt}>
                {t('walletconnect.connected')}
                {' - Network: '}
                {CryptoService.CHAIN_ID_TYPE_MAP[WalletconnectStore.chainId]}
              </Text>
            </View>
          ) : null}
          <Text style={styles.subtitle} numberOfLines={2}>
            {WalletconnectStore.peerMeta.name}
          </Text>
          {showTxDetails()}
        </View>
        {renderActionRequest()}
        {renderAuthRequest()}
      </View>
    );
  };

  const acceptRequest = async (method: any) => {
    try {
      // Get the coresponding wallet for the chain
      const chainType =
        CryptoService.CHAIN_ID_TYPE_MAP[WalletconnectStore.chainId];
      // Get the coin descriptor for the chain native asset
      const cryptoWalletDescriptor = WalletStore.getWalletByCoinId(
        CryptoService.getChainNativeAsset(chainType),
        chainType,
      );
      // Get the chain private key for signature
      const chainKeys = await CryptoService.getChainPrivateKeys();
      const chainAddress = WalletStore.getWalletAddressByChain(chainType);
      // Build the crypto wallet to send the transaction with
      const cryptoWallet = WalletFactory.getWallet(
        Object.assign({}, cryptoWalletDescriptor, {
          walletAddress: chainAddress,
          privKey: chainKeys.ETH,
        }),
      );
      if (!cryptoWallet) {
        WalletConnectService.rejectRequest({
          id: WalletconnectStore.transactionData.id!,
          error: t('message.error.wallet_connect.chain_not_supported'),
        });
      }
      const signingManager = cryptoWallet.getSigningManager();
      if (!signingManager) {
        WalletConnectService.rejectRequest({
          id: WalletconnectStore.transactionData.id!,
          error: t('message.error.wallet_connect.chain_not_signable'),
        });
        return;
      }
      // Build and send the transaction proposal
      let result: any = '';

      if (method === WALLETCONNECT_STATUS.SIGN_TRANSACTION) {
        const params = WalletconnectStore.transactionData.params[0]!;
        const tx = await signingManager.signTransaction(params);
        result = tx;
      }

      if (method === WALLETCONNECT_STATUS.SEND_TRANSACTION) {
        const params = WalletconnectStore.transactionData.params[0]!;
        const tx = await signingManager.signTransaction(params);
        result = await cryptoWallet.postRawTxSend(tx);
      }

      if (method === WALLETCONNECT_STATUS.SIGN_TYPED_DATA) {
        const params = JSON.parse(
          WalletconnectStore.transactionData.params[1]!,
        );
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
        <Animatable.View
          style={{marginBottom: 30, width: '100%'}}
          animation="bounceIn">
          <BigButton
            text={t('walletconnect.approve')}
            backgroundColor={Colors.foreground}
            color={Colors.background}
            onPress={async () => acceptRequest(WalletconnectStore.status)}
          />
          <SmallButton
            text={t('walletconnect.reject')}
            onPress={() =>
              WalletConnectService.rejectRequest({
                id: WalletconnectStore.transactionData.id!,
                error: '',
              })
            }
            color={Colors.foreground}
            style={[
              styles.smallBtn,
              {backgroundColor: Colors.darker, width: 280},
            ]}
          />
        </Animatable.View>
      );
    }
    return null;
  };

  const renderAuthRequest = () => {
    if (WalletconnectStore.status !== WALLETCONNECT_STATUS.SESSION_REQUEST) {
      return null;
    }
    // if chain not supported display warning and CLOSE button
    const chainType =
      CryptoService.CHAIN_ID_TYPE_MAP[WalletconnectStore.chainId];
    if (!chainType) {
      WalletConnectService.rejectSession();
      showMessage({
        message: t('walletconnect.wrong_chain'),
        type: 'warning',
      });
      return;
    }
    return (
      <Animatable.View
        style={{marginBottom: 30, width: '100%'}}
        animation="bounceIn">
        <Text style={styles.subtitle}>
          {t('walletconnect.trying_to_connect')}
        </Text>
        <BigButton
          text={t('walletconnect.accept')}
          onPress={() => {
            // Get the coresponding wallet for the chain
            WalletConnectService.acceptSession(
              WalletconnectStore.chainId,
              WalletStore.getWalletAddressByChain(chainType),
            );
          }}
          backgroundColor={Colors.foreground}
          color={Colors.background}
        />
        <SmallButton
          text={t('walletconnect.reject')}
          onPress={() => WalletConnectService.rejectSession()}
          color={Colors.foreground}
          style={[
            styles.smallBtn,
            {backgroundColor: Colors.darker, width: 250},
          ]}
        />
      </Animatable.View>
    );
  };

  const renderDisconnect = () => {
    if (WalletconnectStore.status !== WALLETCONNECT_STATUS.CONNECTED) {
      return null;
    }
    return (
      <View style={styles.disconnect}>
        <BigButton
          text={t('walletconnect.disconnect')}
          backgroundColor={Colors.foreground}
          color={Colors.background}
          onPress={() => WalletConnectService.closeSession()}
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
