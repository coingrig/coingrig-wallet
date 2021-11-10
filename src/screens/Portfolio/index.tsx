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
import Icon from 'react-native-vector-icons/Ionicons';
import WalletListItem from 'components/walletlistitem';
import {Colors} from 'utils/colors';
// import {MarketStore} from 'stores/market';
import {observer} from 'mobx-react-lite';
import {COINS_MAX} from '../../utils/constants';
import {styles} from './styles';
import {showMessage} from 'react-native-flash-message';
import {IWallet, WalletStore} from 'stores/wallet';
import {CryptoService} from 'services/crypto';

const PortfolioScreen = observer(() => {
  const FILTER_ALL = 'all';
  const FILTER_GAINERS = 'gainers';
  const FILTER_LOSERS = 'losers';
  const navigation = useNavigation();
  // const {t} = useTranslation();
  const [searchFilter, setSearchFilter] = useState(FILTER_ALL);
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SearchScreen', {onlySupported: true})
          }
          style={styles.moreBtn}>
          <Icon name="add-circle" size={25} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    fetchCoins();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setReload(true);
    });

    return unsubscribe;
  }, [navigation]);

  const fetchCoins = async () => {
    const fetchedCoins = await CryptoService.getAccountBalance();
    if (!fetchedCoins) {
      showMessage({
        message: t('message.error.remote_servers_not_available'),
        type: 'warning',
      });
    }
    setRefreshing(false);
  };

  const renderItem = ({item}: {item: IWallet}) => {
    return (
      <WalletListItem
        key={item.cid}
        coin={item}
        onPress={() =>
          //@ts-ignore
          navigation.navigate('WalletScreen', {
            coin: item.cid,
            symbol: item.symbol,
          })
        }
      />
    );
  };

  let getCoinsData = (): any[] => {
    let list = WalletStore.wallets ?? [];
    return list;
  };

  let getCoinFilterStyle = type => {
    if (searchFilter === type) {
      return styles.appButtonContainerSelected;
    }
    return styles.appButtonContainer;
  };

  const listHeader = () => {
    return (
      <View>
        <View style={styles.pillsContainer}>
          <TouchableOpacity
            style={getCoinFilterStyle(FILTER_ALL)}
            onPress={() => {
              setSearchFilter(FILTER_ALL);
            }}>
            <Text style={styles.appButtonText}>
              {t('market.all')} {COINS_MAX}
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
        data={WalletStore.wallets.slice()}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.cid}
        maxToRenderPerBatch={5}
        initialNumToRender={10}
        ListHeaderComponent={listHeader()}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.title}>{t('Portfolio')} </Text>
        </View>
      </View>
      {renderList()}
    </View>
  );
});

export default PortfolioScreen;
