import React, {useEffect, createRef} from 'react';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';

import ActionSheet from 'react-native-actions-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

import {useTranslation} from 'react-i18next';
import {styles} from './styles';
import {Colors} from 'utils/colors';
import {observer} from 'mobx-react-lite';

import {
  WalletConnectService,
  WALLETCONNECT_STATUS,
} from '../../services/walletconnect';
import {WalletconnectStore} from '../../stores/walletconnect';
import {CryptoService} from 'services/crypto';
import {WalletStore} from 'stores/wallet';
import {WalletFactory} from '@coingrig/core';
import {Fees} from '@coingrig/core';

const actionCamera: React.RefObject<any> = createRef();

const WalletconnectScreen = observer(() => {
  const {t} = useTranslation();

  useEffect((): any => {
    return WalletConnectService.closeSession;
  }, []);

  const onSuccess = e => {
    console.log(e.data);
    let uri = e.data;
    const data: any = {uri};
    data.redirect = '';
    data.autosign = false;
    if (!WalletConnectService.init(data)) {
      // Display error message
    }
    actionCamera.current?.setModalVisible(false);
  };

  const renderPeerMeta = () => {
    if (WalletconnectStore.status === WALLETCONNECT_STATUS.CONNECTING) {
      return (
        <View>
          <Text style={styles.subtitle}>
            {t('walletconnect.connecting_in_progress')}
          </Text>

          <TouchableOpacity onPress={() => WalletConnectService.closeSession()}>
            <Text style={styles.subtitle}>{t('walletconnect.disconnect')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (WalletconnectStore.status === WALLETCONNECT_STATUS.DISCONNECTED) {
      return (
        <TouchableOpacity
          onPress={() => actionCamera.current?.setModalVisible()}>
          <Text style={styles.subtitle}>{t('walletconnect.scan')}</Text>
          <Icon name="qr-code" size={21} color={Colors.foreground} />
        </TouchableOpacity>
      );
    }
    if (!WalletconnectStore.peerMeta) {
      return null;
    }
    return (
      <View>
        <Text style={styles.subtitle}>{WalletconnectStore.peerMeta.name}</Text>
      </View>
    );
  };

  const renderActionRequest = () => {
    if (WalletconnectStore.status === WALLETCONNECT_STATUS.SEND_TRANSACTION) {
      return (
        <View>
          <TouchableOpacity
            onPress={() =>
              WalletConnectService.rejectRequest({
                id: WalletconnectStore.transactionData.id!,
                error: '',
              })
            }>
            <Text style={styles.subtitle}>{t('walletconnect.reject')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
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
                let chainAddress =
                  WalletStore.getWalletAddressByChain(chainType);
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
                    error: '',
                  });
                }
                // Build and send the transaction proposal
                let params = WalletconnectStore.transactionData.params[0]!;
                console.log(params);
                let hash = await cryptoWallet!.postTxSend(
                  new Fees.BnbFee({
                    signatureId: undefined,
                    fromPrivateKey: chainKeys.ETH,
                    fee: {
                      // Just for display purposes
                      gasLimit: params.gas,
                      gasPrice: params.gasPrice,
                    },
                    proposal: params,
                  }),
                );
                WalletConnectService.approveRequest({
                  id: WalletconnectStore.transactionData.id!,
                  result: hash,
                });
              } catch (e: any) {
                console.log(e);
                WalletConnectService.rejectRequest({
                  id: WalletconnectStore.transactionData.id!,
                  error: e?.message,
                });
              }
            }}>
            <Text style={styles.subtitle}>{t('walletconnect.accept')}</Text>
          </TouchableOpacity>
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
    return (
      <View>
        <TouchableOpacity onPress={() => WalletConnectService.rejectSession()}>
          <Text style={styles.subtitle}>{t('walletconnect.reject')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // Get the coresponding wallet for the chain
            let chainType =
              CryptoService.CHAIN_ID_TYPE_MAP[WalletconnectStore.chainId];
            WalletConnectService.acceptSession(
              WalletconnectStore.chainId,
              WalletStore.getWalletAddressByChain(chainType),
            );
          }}>
          <Text style={styles.subtitle}>{t('walletconnect.accept')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDisconnect = () => {
    if (WalletconnectStore.status !== WALLETCONNECT_STATUS.CONNECTED) {
      return null;
    }
    return (
      <View>
        <TouchableOpacity onPress={() => WalletConnectService.closeSession()}>
          <Text style={styles.subtitle}>{t('walletconnect.disconnect')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View>
          {renderPeerMeta()}
          {renderAuthRequest()}
          {renderActionRequest()}
          {renderDisconnect()}
        </View>
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
