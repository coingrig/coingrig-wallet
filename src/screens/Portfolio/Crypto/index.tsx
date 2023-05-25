/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import WalletListItem from 'components/walletlistitem';
import {IWallet, WalletStore} from 'stores/wallet';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice} from 'utils';
import {CryptoService} from 'services/crypto';
import {showMessage} from 'react-native-flash-message';

const Crypto = observer(() => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SearchScreen', {onlySupported: true})
            }
            style={styles.moreBtn}>
            <Icon name="add-circle" size={25} color={Colors.foreground} />
          </TouchableOpacity>
        </View>
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
  };

  const renderItem = ({item}: {item: IWallet}) => (
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
  const listHeader = () => {
    const showNFTs = false;
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>
          {showNFTs ? t('portfolio.my_nfts') : t('portfolio.my_assets')}
        </Text>
        <Text style={styles.subRight}>
          {showNFTs
            ? t('Ethereum')
            : formatPrice(WalletStore.totalBalance, true) || 0.0}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={{justifyContent: 'center', flex: 1}}>
        <FlatList
          data={WalletStore.wallets}
          renderItem={renderItem}
          keyExtractor={(item: any, index) =>
            item.cid + item.chain + index.toString() ?? ''
          }
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader()}
          style={{marginHorizontal: 10}}
        />
      </View>
    </View>
  );
});

export default Crypto;
