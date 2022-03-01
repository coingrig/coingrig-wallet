/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import {SegmentedControl, Segment} from 'react-native-resegmented-control';
import WalletListItem from 'components/walletlistitem';
import NFTCard from 'components/NFT/Card';
import {Colors} from 'utils/colors';
import {observer} from 'mobx-react-lite';
import {styles} from './styles';
import {showMessage} from 'react-native-flash-message';
import {IWallet, WalletStore} from 'stores/wallet';
import {CryptoService} from 'services/crypto';
import {formatPrice} from 'utils';
import BigList from 'react-native-big-list';
import endpoints from 'utils/endpoints';
import Portfolios from 'data/portfolios';

const PortfolioScreen = observer(() => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef: any = useRef();
  const [screen, setScreen] = useState(Portfolios[0]);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchCoins();
  }, []);

  const bubble = (item, index) => {
    return (
      <TouchableOpacity
        key={item.title}
        onPress={() => {
          setScreen(item);
          scrollRef.current?.scrollTo({
            x: index * 70,
            animated: true,
          });
        }}
        style={{
          backgroundColor:
            screen.title === item.title ? Colors.foreground : Colors.darker,
          flex: 1,
          padding: 5,
          paddingHorizontal: 15,
          borderRadius: 15,
          marginHorizontal: 3,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          minWidth: 70,
        }}>
        <Text
          style={{
            fontSize: 14,
            color:
              screen.title === item.title
                ? Colors.background
                : Colors.foreground,
          }}>
          {t(item.title)}
        </Text>
      </TouchableOpacity>
    );
  };

  // const RenderScreen = React.memo(() => {
  //   return <screen.component />;
  // });

  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.title} numberOfLines={1}>
            {t('portfolio.portfolio')}
          </Text>
          <Text style={styles.balance} numberOfLines={1}>
            {formatPrice(WalletStore.totalBalance, true) || 0.0}
          </Text>
        </View>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingRight: 20}}
          style={{paddingTop: 10, paddingHorizontal: 12, paddingBottom: 5}}>
          {Portfolios.map((item, index) => bubble(item, index))}
        </ScrollView>
      </View>
      {/* <RenderScreen /> */}
      <screen.component />
    </View>
  );
});

export default PortfolioScreen;
