/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import MarketItem from 'components/marketItem';
import {Colors} from 'utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {MarketStore, MarketCapCoinType} from 'stores/market';
import {observer} from 'mobx-react-lite';
import {COINS_MAX} from '../../utils/constants';
import {styles} from './styles';
import {showMessage} from 'react-native-flash-message';
import FastImage from 'react-native-fast-image';
import {ILogEvents, LogEvents} from 'utils/analytics';

const MarketScreen = observer(() => {
  const FILTER_ALL = 'all';
  const FILTER_GAINERS = 'gainers';
  const FILTER_LOSERS = 'losers';
  const navigation = useNavigation();
  const [searchFilter, setSearchFilter] = useState(FILTER_ALL);
  const {t} = useTranslation();
  // const [imgHeight, setImgHeight] = useState(200);
  // const [imgOpac, setImgOpac] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            //@ts-ignore
            navigation.navigate('SearchScreen', {onlySupported: false})
          }
          style={styles.moreBtn}>
          <Icon name="search" size={22} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    fetchCoins();
    LogEvents(ILogEvents.SCREEN, 'CryptoMarket');
  }, []);

  const fetchCoins = async () => {
    const fetchedCoins = await MarketStore.getTopCoins(COINS_MAX);
    if (!fetchedCoins) {
      showMessage({
        message: t('message.error.remote_servers_not_available'),
        type: 'warning',
      });
    }
    setRefreshing(false);
  };

  const renderItem = ({item}: {item: MarketCapCoinType}) => {
    return (
      <MarketItem
        key={item.id}
        coin={item.symbol}
        name={item.name}
        price={item.current_price}
        image={item.image}
        change={item.price_change_percentage_24h}
        onPress={() =>
          //@ts-ignore
          navigation.navigate('CoinDetailScreen', {
            coin: item.id,
            title: item.symbol,
            showAdd: false,
          })
        }
      />
    );
  };

  const getCoinsData = (): MarketCapCoinType[] => {
    let list = MarketStore.coins ?? [];
    if (searchFilter !== FILTER_ALL) {
      list = MarketStore.coins.filter((o: MarketCapCoinType) => {
        if (searchFilter === FILTER_GAINERS) {
          return o.price_change_percentage_24h > 0;
        }
        return o.price_change_percentage_24h < 0;
      });
      list.sort((a: MarketCapCoinType, b: MarketCapCoinType) => {
        if (searchFilter === FILTER_GAINERS) {
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        }
        return a.price_change_percentage_24h - b.price_change_percentage_24h;
      });
    }
    return list;
  };

  const getCoinFilterStyle = type => {
    if (searchFilter === type) {
      return styles.appButtonContainerSelected;
    }
    return styles.appButtonContainer;
  };

  const listHeader = () => {
    return (
      <View>
        <FastImage
          source={require('../../assets/hub/market.png')}
          resizeMode="contain"
          style={{
            height: 190,
            width: '100%',
            marginVertical: 10,
          }}
        />
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{t('portfolio.my_assets')}</Text>
          <View style={styles.pillsContainer}>
            <TouchableOpacity
              style={getCoinFilterStyle(FILTER_ALL)}
              onPress={() => {
                setSearchFilter(FILTER_ALL);
              }}>
              <Text style={styles.appButtonText}>
                {t('market.top')} {COINS_MAX}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={getCoinFilterStyle(FILTER_GAINERS)}
              onPress={() => {
                setSearchFilter(FILTER_GAINERS);
              }}>
              <Text style={styles.appButtonText}>{t('market.gainers')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={getCoinFilterStyle(FILTER_LOSERS)}
              onPress={() => {
                setSearchFilter(FILTER_LOSERS);
              }}>
              <Text style={styles.appButtonText}>{t('market.losers')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchCoins();
  }, []);

  const renderList = () => {
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.lighter}
            colors={[Colors.lighter]}
          />
        }
        data={getCoinsData()}
        renderItem={renderItem}
        keyExtractor={(item: MarketCapCoinType) => item.id}
        maxToRenderPerBatch={5}
        initialNumToRender={10}
        ListHeaderComponent={listHeader()}
        // onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        // eslint-disable-next-line react-native/no-inline-styles
        ListFooterComponent={() => <View style={{height: 30}} />}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View />
      {renderList()}
    </View>
  );
});

export default MarketScreen;
