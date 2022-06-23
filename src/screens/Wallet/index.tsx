/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback, createRef} from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Feather';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import {WalletStore} from 'stores/wallet';
import {formatCoins, formatNoComma, formatPrice} from 'utils';
import FastImage from 'react-native-fast-image';
import {styles} from './styles';
import {CryptoService} from 'services/crypto';
import {Colors} from 'utils/colors';
import {showMessage} from 'react-native-flash-message';
import {SettingsStore} from 'stores/settings';
import ActionSheet from 'react-native-actions-sheet';
import {SmallButton} from 'components/smallButton';
import {ILogEvents, LogEvents} from 'utils/analytics';

const editSheet: React.RefObject<any> = createRef();

const WalletScreen = observer(({route}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [customBalance, setCustomBalance] = useState('');
  const chain = CryptoService.getSupportedChainNamebyID(
    WalletStore.getWalletByCoinId(route.params.symbol, route.params.chain)
      ?.chain,
  );
  useEffect(() => {
    const w = WalletStore.getWalletByCoinId(
      route.params.symbol,
      route.params.chain,
    );
    navigation.setOptions({
      headerTitle: route.params.symbol,
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          {w?.price === 0 || w?.type === 'custom-token' ? null : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CoinDetailScreen', {
                  coin: route.params.coin,
                  chain: route.params.chain,
                  title: route.params.symbol,
                  showAdd: false,
                });
              }}
              style={styles.moreBtn}>
              <Icon name="stats-chart" size={19} color={Colors.foreground} />
            </TouchableOpacity>
          )}
          {w?.type === 'external' ? null : (
            <TouchableOpacity
              onPress={() => showTransactions()}
              style={styles.moreBtn}>
              <Icon name="list" size={24} color={Colors.foreground} />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
    LogEvents(ILogEvents.SCREEN, 'WalletDetails');
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setTimeout(() => {
  //       CryptoService.updateWalletBalance(
  //         route.params.symbol,
  //         route.params.chain,
  //       );
  //     }, 2000);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBalance();
  }, []);
  const fetchBalance = useCallback(async () => {
    const success = await CryptoService.updateWalletBalance(
      route.params.symbol,
      route.params.chain,
    );
    if (!success) {
      showMessage({
        message: t('message.error.remote_servers_not_available'),
        type: 'warning',
      });
    }
    setRefreshing(false);
  }, []);

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
  const deleteWallet = async wallet => {
    if (!wallet) {
      return;
    }
    Alert.alert(t('wallet.delete_wallet'), t('wallet.alert_delete_wallet'), [
      {
        text: t('settings.cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: t('settings.yes'),
        onPress: async () => {
          const wIndex = WalletStore.wallets.indexOf(wallet!);
          if (wIndex) {
            WalletStore.deleteWallet(wIndex);
            navigation.goBack();
          }
        },
      },
    ]);
  };
  const showTransactions = () => {
    const w = WalletStore.getWalletByCoinId(
      route.params.symbol,
      route.params.chain,
    );
    if (route.params.chain === 'BTC') {
      openLink(CryptoService.getBlockExplorer(w?.chain!));
    } else {
      const convChain =
        route.params.chain === 'POLYGON' ? 'matic' : route.params.chain;
      navigation.navigate('HistoryScreen', {chain: convChain.toLowerCase()});
    }
  };

  const buySellAction = () => {
    navigation.navigate('TradeScreen', {
      symbol: route.params.symbol,
      chain: route.params.chain,
      price: WalletStore.getWalletByCoinId(
        route.params.symbol,
        route.params.chain,
      )?.price,
    });
    // const w = WalletStore.getWalletByCoinId(
    //   route.params.symbol,
    //   route.params.chain,
    // );
    // const address = WalletStore.getWalletAddressByChain(w?.chain!);
    // let coin = route.params.symbol.toUpperCase();
    // if (coin === 'BNB') {
    //   coin = 'BSC_BNB';
    // }
    // const link =
    //   endpoints.ramper +
    //   '&hostApiKey=' +
    //   CONFIG.RAMP_KEY +
    //   '&userAddress=' +
    //   address +
    //   '&swapAsset=' +
    //   coin;
    // LogEvents(ILogEvents.CLICK, 'BuyCrypto');
    // openLink(link);
  };

  const renderUnconfirmedTx = () => {
    if (!route.params.chain) {
      return null;
    }
    const unconfTxValue = WalletStore.getWalletByCoinId(
      route.params.symbol,
      route.params.chain,
    )?.unconfirmedBalance;
    if (SettingsStore.confirmationEnabled && unconfTxValue !== 0) {
      return (
        <View style={styles.smallCard}>
          <Text style={styles.unconfTxt}>{t('wallet.unconfirmed_tx')}</Text>
          <Text
            style={[
              styles.unconfValue,
              {
                color: unconfTxValue! >= 0 ? Colors.green : Colors.red,
              },
            ]}>
            {unconfTxValue || 0} {route.params.symbol}
          </Text>
        </View>
      );
    }
  };

  const buyOrTx = () => {
    const w = WalletStore.getWalletByCoinId(
      route.params.symbol,
      route.params.chain,
    );
    if (w?.type === 'coin') {
      return (
        <View>
          <TouchableOpacity
            onPress={() => buySellAction()}
            style={styles.roundBtn}>
            <Icon2 name="dollar" size={20} color={Colors.background} />
          </TouchableOpacity>
          <Text style={styles.roundb}>{t('Trade')}</Text>
        </View>
      );
    }
  };

  const renderSwap = () => {
    // alert(route.params.chain);
    if (
      route.params.symbol !== 'BTC' &&
      !route.params.chain.startsWith('cg_')
    ) {
      return (
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SwapScreen', {
                wallet: WalletStore.getWalletByCoinId(
                  route.params.symbol,
                  route.params.chain,
                ),
              })
            }
            style={styles.roundBtn}>
            <Icon2 name="exchange" size={18} color={Colors.background} />
          </TouchableOpacity>
          <Text style={styles.roundb}>{t('hub.swap')}</Text>
        </View>
      );
    }
  };

  const renderButtons = wallet => {
    if (!wallet) {
      return;
    }
    if (wallet.type === 'external') {
      return (
        <View style={styles.btnCointainers}>
          <View>
            <TouchableOpacity
              onPress={() => {
                setCustomBalance(wallet.balance.toString());
                editSheet.current?.setModalVisible(true);
              }}
              style={styles.roundBtn}>
              <Icon3
                name="circle-edit-outline"
                size={23}
                color={Colors.background}
              />
            </TouchableOpacity>
            <Text style={styles.roundb}>{t('wallet.edit')}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.btnCointainers}>
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SendReceiveScreen', {
                  coin: route.params.symbol,
                  chain: route.params.chain,
                  name: wallet?.name,
                  receive: false,
                })
              }
              style={styles.roundBtn}>
              <Icon name="arrow-up" size={20} color={Colors.background} />
            </TouchableOpacity>
            <Text style={styles.roundb}>{t('wallet.send')}</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SendReceiveScreen', {
                  coin: route.params.symbol,
                  chain: route.params.chain,
                  name: wallet?.name,
                  receive: true,
                })
              }
              style={styles.roundBtn}>
              <Icon name="arrow-down" size={20} color={Colors.background} />
            </TouchableOpacity>
            <Text style={styles.roundb}>{t('wallet.receive')}</Text>
          </View>
          {renderSwap()}
          {buyOrTx()}
        </View>
      );
    }
  };

  const screen = () => {
    const wallet = WalletStore.getWalletByCoinId(
      route.params.symbol,
      route.params.chain,
    );
    return (
      <View style={{flexGrow: 1}}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.lighter}
              colors={[Colors.lighter]}
            />
          }>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.pills}>
              <Text style={{fontSize: 12, color: Colors.lighter}}>
                {t('coindetails.price') +
                  ': ' +
                  formatPrice(
                    WalletStore.getWalletByCoinId(
                      route.params.symbol,
                      route.params.chain,
                    )?.price,
                  )}
              </Text>
            </View>
            <View style={styles.pills}>
              <Text style={{fontSize: 12, color: Colors.lighter}}>
                {(chain ? chain : t('wallet.added_manually')) + ' '}
                {chain.length < 15 && chain ? t('wallet.network') : null}
              </Text>
            </View>
          </View>

          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.bigText}>
            {formatPrice(
              WalletStore.getWalletByCoinId(
                route.params.symbol,
                route.params.chain,
              )?.value ?? 0,
              true,
            ) || 0}
          </Text>
          <Text style={styles.coins}>
            {formatCoins(
              WalletStore.getWalletByCoinId(
                route.params.symbol,
                route.params.chain,
              )?.balance,
            ) || 0}{' '}
            {route.params.symbol}
          </Text>
          {renderButtons(wallet)}
          {renderUnconfirmedTx()}
        </ScrollView>
        <FastImage
          style={styles.logoimg}
          source={{
            uri: wallet?.image!,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <Svg
          viewBox="0 0 400 150"
          preserveAspectRatio="none"
          style={styles.svg}>
          <Path
            d="M0 49.98c149.99 100.02 349.2-99.96 500 0V150H0z"
            fill={Colors.darker}
          />
        </Svg>
        {wallet?.type === 'token' ||
        wallet?.type === 'custom-token' ||
        wallet?.type === 'external' ? (
          <View style={{right: 20, bottom: 40, position: 'absolute'}}>
            <TouchableOpacity
              onPress={() => deleteWallet(wallet)}
              style={styles.deleteBtn}>
              <Icon4 name="trash-2" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : null}
        <ActionSheet
          //@ts-ignore
          ref={editSheet}
          keyboardShouldPersistTaps="always"
          // gestureEnabled={true}
          // headerAlwaysVisible
          containerStyle={styles.editContainer}>
          <Text style={styles.editTitle}>
            {t('wallet.edit_balance') + ' (' + wallet?.symbol + ')'}
          </Text>
          <TextInput
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={'gray'}
            style={styles.editInput}
            value={customBalance}
            onChangeText={v => setCustomBalance(v)}
          />
          <SmallButton
            text={t('swap.slippage_save')}
            onPress={() => {
              WalletStore.setBalance(
                wallet?.symbol,
                wallet?.chain,
                Number(formatNoComma(customBalance)),
              );
              editSheet.current?.setModalVisible(false);
            }}
            color="#f2eded"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              backgroundColor: '#2e2c2c',
              width: '70%',
              marginTop: 20,
              marginBottom: 20,
            }}
          />
        </ActionSheet>
      </View>
    );
  };

  return screen();
});

export default WalletScreen;
