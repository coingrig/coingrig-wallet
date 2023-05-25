/* eslint-disable react-hooks/exhaustive-deps */
import React, {createRef, useCallback, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  RefreshControl,
  FlatList,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {useTransitionEnd} from 'utils/hooks/useTransitionEnd';
import {Colors} from 'utils/colors';
import {SIZE} from 'utils/constants';
import {styles} from './styles';
import {LineChart} from 'react-native-chart-kit';
import {Loader} from 'components/loader';
import {formatPrice, formatNumber, convertExponential} from 'utils';
import {showMessage} from 'react-native-flash-message';
import {CryptoService} from 'services/crypto';
import {SmallButton} from 'components/smallButton';
import ActionSheet from 'react-native-actions-sheet';
import {WalletStore} from 'stores/wallet';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Logs} from 'services/logs';
import {ILogEvents, LogEvents} from 'utils/analytics';

const actionSheetRef = createRef();

const CoinDetailScreen = observer(({route}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [price, setPrice] = useState('0');
  const [showScreen, setShowScreen] = useState(false);
  const [coinData, setCoinData] = useState<any>();
  const [chartData, setChartData] = useState([]);
  const [platforms, setPlatforms] = useState<any>([]);
  const transitionEnded = useTransitionEnd(navigation);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle:
        route.params.title?.toUpperCase() ?? route.params.coin.toUpperCase(),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => openLink(route.params.coin)}
          style={styles.moreBtn}>
          <Icon name="external-link" size={22} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    LogEvents(ILogEvents.SCREEN, 'CoinDetails');
  }, []);

  useEffect(() => {
    if (transitionEnded) {
      getData();
    }
  }, [transitionEnded]);

  const openLink = async coin => {
    const url = 'https://www.coingecko.com/en/coins/' + coin;
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          dismissButtonStyle: 'cancel',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'automatic',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Logs.error(error);
    }
  };

  const getData = async () => {
    // get data from coingecko
    const data = await CryptoService.getCoinDetails(route.params.coin);
    const mappedPlatforms: any = [];
    for (const [key, value] of Object.entries(data.platforms)) {
      // Sanity check, the data comes with a "":"" pair
      if (key === '' || value === '') {
        continue;
      }
      // Is this chain supported?
      const platformChain = CryptoService.getSupportedChainbyName(key);
      if (platformChain === '') {
        continue;
      }
      // Is the wallet already registered?
      const existingWallets = WalletStore.wallets.filter(
        o =>
          o.chain === platformChain &&
          (o.contract === value || o.symbol === data.symbol.toUpperCase()),
      );
      if (existingWallets.length > 0) {
        continue;
      }
      // All good, add to list
      mappedPlatforms.push({
        chain: platformChain,
        contract: value,
      });
    }
    setPlatforms(mappedPlatforms);

    if (!data) {
      showMessage({
        message: t('message.error.remote_servers_not_available'),
        type: 'warning',
      });
      setShowScreen(false);
      return;
    }
    let convertPrice = convertExponential(data?.market_data.current_price?.usd);
    convertPrice = formatPrice(convertPrice);
    setPrice(convertPrice);
    if (route.params.img) {
      try {
        data.image.large = route.params.img;
        data.name = route.params.title;
      } catch (error) {
        Logs.error(error);
      }
    }
    setCoinData(data);
    setChartData(data?.market_data.sparkline_7d?.price ?? []);
    setShowScreen(true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  }, []);

  const addWallet = async () => {
    //@ts-ignore
    actionSheetRef.current?.setModalVisible(true);
  };

  const saveWallet = (platform, contract, external) => {
    CryptoService.prepareNewWallet(coinData, platform, contract, external);
    if (!external) {
      // Remove the added platform from the availability list to add
      setPlatforms(platforms.filter(o => o.chain !== platform));
    }
    //@ts-ignore
    actionSheetRef.current?.setModalVisible(false);
    //TODO: Translate
    showMessage({
      message: t('message.wallet.token.added'),
      type: 'success',
    });
    navigation.goBack();
  };

  const addToPortfolio = () => {
    // Display if chain is supported and if is not already added
    if (route.params.showAdd) {
      return (
        <SmallButton
          text={t('coindetails.add_to_portfolio')}
          onPress={() => addWallet()}
          color={Colors.darker}
          style={styles.addtoPortfolio}
        />
      );
    }
  };

  const screen = () => (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.lighter}
          colors={[Colors.lighter]}
        />
      }>
      <View style={styles.container}>
        <View style={styles.subcont}>
          <View>
            <Text style={styles.subTitleTop}>{t('coindetails.price')}</Text>
            <Text style={styles.title} adjustsFontSizeToFit numberOfLines={2}>
              {price}
            </Text>
          </View>
          <View style={{marginRight: 15}}>
            <Text style={styles.subTitleTop}>{t('coindetails.change')}</Text>
            <View
              style={[
                styles.change,
                {
                  backgroundColor:
                    //@ts-ignore
                    coinData?.market_data.price_change_percentage_24h < 0
                      ? '#d9534f'
                      : '#5cb85c',
                },
              ]}>
              <Text
                style={[
                  styles.title2,
                  {
                    fontWeight: 'normal',
                    textAlign: 'right',
                  },
                ]}
                adjustsFontSizeToFit
                numberOfLines={2}>
                {coinData?.market_data.price_change_percentage_24h?.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.linechart}>
          {chartData.length === 0 ? null : (
            <LineChart
              withVerticalLabels={false}
              withHorizontalLabels={false}
              withHorizontalLines={false}
              useShadowColorFromDataSet={false}
              width={SIZE.width - 5}
              height={160}
              bezier
              withDots={false}
              withVerticalLines={false}
              withOuterLines={false}
              chartConfig={{
                color: () => Colors.lighter,
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                fillShadowGradient: Colors.background,
                // fillShadowGradientOpacity: 0,
              }}
              style={styles.chart}
              //@ts-ignore
              data={{
                datasets: [
                  {
                    data: chartData,
                  },
                ],
              }}
            />
          )}
          <Text style={styles.txtBg}>{t('coindetails.last_7_days')}</Text>
        </View>
        <View style={{backgroundColor: Colors.darker}}>
          {addToPortfolio()}
          <View style={styles.viewStats}>
            <Text style={styles.subTitle} numberOfLines={1}>
              {coinData?.name ?? '-' + ' ' + t('coindetails.stats')}
            </Text>
            {coinData?.image ? (
              <FastImage
                style={styles.logoimg}
                source={{
                  uri: coinData?.image.large,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
              />
            ) : null}
          </View>
        </View>
        <View style={styles.viewStatsDetail}>
          <View style={styles.item}>
            <Text style={styles.itemtext}>#{t('coindetails.rank')}</Text>
            <Text style={styles.textr}>{coinData?.market_cap_rank ?? '-'}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemtext}>{t('coindetails.marketcap')}:</Text>
            <Text style={styles.textr}>
              {formatPrice(coinData?.market_data.market_cap.usd ?? '-')}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemtext}>{t('coindetails.volume')}:</Text>
            <Text style={styles.textr}>
              {formatPrice(coinData?.market_data.total_volume.usd ?? '-')}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemtext}>
              {t('coindetails.all_time_high')}:
            </Text>
            <Text style={styles.textr}>
              {formatPrice(coinData?.market_data.ath.usd ?? '-')}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemtext}>{t('coindetails.high_24')}:</Text>
            <Text style={styles.textr}>
              {formatPrice(coinData?.market_data.high_24h.usd ?? 0)}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemtext}>{t('coindetails.low_24h')}:</Text>
            <Text style={styles.textr}>
              {formatPrice(coinData?.market_data.low_24h.usd ?? 0)}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemtext}>
              {t('coindetails.circulating_supply')}:
            </Text>
            <Text style={styles.textr}>
              {coinData?.market_data.circulating_supply != null
                ? formatNumber(coinData?.market_data.circulating_supply ?? 0)
                : '-'}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemtext}>{t('coindetails.max_supply')}:</Text>
            <Text style={styles.textr}>
              {coinData?.market_data.max_supply != null
                ? formatNumber(coinData?.market_data.max_supply ?? 0)
                : '-'}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemtext}>
              {t('coindetails.total_supply')}:
            </Text>
            <Text style={styles.textr}>
              {coinData?.market_data.total_supply != null
                ? formatNumber(coinData?.market_data.total_supply ?? 0)
                : '-'}
            </Text>
          </View>
        </View>
        <Text style={styles.coingecko}>{t('market.provider')}</Text>
      </View>
      <ActionSheet
        //@ts-ignore
        ref={actionSheetRef}
        gestureEnabled={true}
        headerAlwaysVisible
        // eslint-disable-next-line react-native/no-inline-styles
        containerStyle={{
          flex: 1,
          backgroundColor: Colors.background,
        }}>
        <View style={{backgroundColor: Colors.background}}>
          {route.params.isSupported && platforms.length > 0 ? (
            <>
              <Text style={styles.choose_network}>
                {t('coindetails.choose_network')}
              </Text>
              <FlatList
                data={platforms}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <View>
                    <SmallButton
                      text={CryptoService.getSupportedChainNamebyID(item.chain)}
                      onPress={() => {
                        saveWallet(item.chain, item.contract, false);
                      }}
                      color={Colors.darker}
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        backgroundColor: Colors.foreground,
                        width: '70%',
                        marginBottom: 5,
                        borderWidth: 0,
                      }}
                    />
                  </View>
                )}
              />

              <Text style={styles.chain_note}>
                {t('coindetails.chain_note')}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.choose_network}>
                {!route.params.isSupported
                  ? t('coindetails.not_available')
                  : t('coindetails.already_title')}
              </Text>
              <Text style={styles.manual_note}>
                {!route.params.isSupported
                  ? t('coindetails.manual_note')
                  : t('coindetails.already_note')}
              </Text>
            </>
          )}
          <SmallButton
            text={t('coindetails.manual')}
            onPress={() => {
              saveWallet(null, null, true);
            }}
            color={Colors.foreground}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              backgroundColor: Colors.background,
              width: '70%',
              borderWidth: 0.5,
              marginBottom: 20,
              borderColor: Colors.foreground,
            }}
          />
        </View>
      </ActionSheet>
    </ScrollView>
  );

  const preRender = () => {
    if (showScreen) {
      return screen();
    }
    return <Loader />;
  };

  return preRender();
});

export default CoinDetailScreen;
