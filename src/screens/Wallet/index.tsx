/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/Ionicons';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import {find} from 'lodash';
import {WalletStore} from 'stores/wallet';
import {MarketCapCoinType, MarketStore} from '../../stores/market';
import {formatPrice} from 'utils';
import FastImage from 'react-native-fast-image';
import {styles} from './styles';
import {CryptoService} from 'services/crypto';
import {Colors} from 'utils/colors';
import {showMessage} from 'react-native-flash-message';
import {SettingsStore} from 'stores/settings';

const WalletScreen = observer(({route}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [coinData, setCoinData] = useState<MarketCapCoinType>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.coin + ' ' + t('wallet.wallet'),
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CoinDetailScreen', {coin: route.params.coin})
          }
          style={styles.moreBtn}>
          <Icon name="stats-chart" size={20} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    getData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        CryptoService.getAccountBalance();
      }, 2000);
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBalance();
  }, []);
  const fetchBalance = useCallback(async () => {
    let success = await CryptoService.getAccountBalance();
    if (!success) {
      showMessage({
        message: t('message.error.remote_servers_not_available'),
        type: 'warning',
      });
    }
    setRefreshing(false);
  }, []);
  const getData = async () => {
    const data = find(MarketStore.coins, o => {
      return o.symbol === route.params.coin.toLowerCase();
    });
    setCoinData(data);
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

  const showTransactions = () => {
    openLink(CryptoService.getBlockExplorer(route.params.coin));
  };

  const renderUnconfirmedTx = () => {
    const unconfTx = WalletStore.getWalletByCoinId(
      route.params.coin,
    )?.unconfirmedBalance;
    if (SettingsStore.confirmationEnabled && unconfTx !== 0) {
      return (
        <View style={styles.smallCard}>
          <Text style={styles.unconfTxt}>{t('wallet.unconfirmed_tx')}</Text>
          <Text
            style={[
              styles.unconfValue,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                color: unconfTx! > 0 ? '#5cb85c' : '#d9534f',
              },
            ]}>
            {unconfTx || 0} {route.params.coin}
          </Text>
        </View>
      );
    }
  };

  const screen = () => {
    return (
      <View style={{flexGrow: 1}}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.lighter}
              colors={[Colors.lighter]}
            />
          }>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.bigText}>
            {formatPrice(
              WalletStore.getWalletByCoinId(route.params.coin)?.value,
            ) || 0}
          </Text>
          <Text style={styles.coins}>
            {WalletStore.getWalletByCoinId(route.params.coin)?.balance || 0}{' '}
            {route.params.coin}
          </Text>
          <View style={styles.btnCointainers}>
            <View style={{marginHorizontal: 15}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SendReceiveScreen', {
                    coin: route.params.coin,
                    name: coinData?.name,
                    receive: false,
                  })
                }
                style={styles.roundBtn}>
                <Icon name="arrow-up" size={20} color={Colors.background} />
              </TouchableOpacity>
              <Text style={styles.roundb}>{t('wallet.send')}</Text>
            </View>
            <View style={{marginHorizontal: 15}}>
              <TouchableOpacity
                onPress={() => showTransactions()}
                style={styles.roundBtn}>
                <Icon name="list" size={20} color={Colors.background} />
              </TouchableOpacity>
              <Text style={styles.roundb}>{t('wallet.transactions')}</Text>
            </View>
            <View style={{marginHorizontal: 15}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SendReceiveScreen', {
                    coin: route.params.coin,
                    name: coinData?.name,
                    receive: true,
                  })
                }
                style={styles.roundBtn}>
                <Icon name="arrow-down" size={20} color={Colors.background} />
              </TouchableOpacity>
              <Text style={styles.roundb}>{t('wallet.receive')}</Text>
            </View>
          </View>
          {renderUnconfirmedTx()}
        </ScrollView>
        <FastImage
          style={styles.logoimg}
          source={{
            uri: coinData?.image,
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
      </View>
    );
  };

  return screen();
});

export default WalletScreen;
