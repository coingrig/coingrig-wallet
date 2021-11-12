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
import {observer} from 'mobx-react-lite';
import {styles} from './styles';
import {showMessage} from 'react-native-flash-message';
import {IWallet, WalletStore} from 'stores/wallet';
import {CryptoService} from 'services/crypto';

const PortfolioScreen = observer(() => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

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
            chain: item.chain,
          })
        }
      />
    );
  };

  const listHeader = () => {
    return (
      <View>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 16,
            fontFamily: 'RobotoSlab-Bold',
            color: Colors.lighter,
            marginBottom: 10,
            marginLeft: 20,
            marginTop: 20,
          }}>
          All wallets
        </Text>
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
        data={WalletStore.wallets}
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
