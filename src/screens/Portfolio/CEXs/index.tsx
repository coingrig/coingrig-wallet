/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatCoins, formatPrice} from 'utils';
import CexService from 'services/cex';
import {CexStore} from 'stores/cexStore';
import {Logs} from 'services/logs';
import {useTranslation} from 'react-i18next';
import {SIZE} from 'utils/constants';
import {showMessage} from 'react-native-flash-message';

const CEXs = observer(() => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('CEXScreen')}
          style={styles.moreBtn}>
          <Icon name="link" size={25} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    CexService.getAllBalances();
  }, []);

  const showMsg = () => {
    showMessage({
      message: t('portfolio.trading_soon'),
      type: 'warning',
    });
  };

  const renderItem = ({item}: {item: any}) => (
    <AccountItem
      key={item.id}
      disable={false}
      onPress={showMsg}
      title={item.symbol || ''}
      img={item.logo || ''}
      subimg={item.image || null}
      subtitle={item.subtitle || ''}
      value={item.balance + ' ' + item.symbol || ''}
      subvalue={item.totalValue || ''}
      showAvatar={null}
    />
  );
  const listHeader = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>{t('portfolio.cexs.tokens')}</Text>
        <Text style={styles.subRight}>
          {formatPrice(CexStore.totalBalance, true) || 0.0}
        </Text>
      </View>
    );
  };

  const mapItems = () => {
    const list: any[] = [];
    try {
      CexStore.cexs.forEach(cex => {
        cex.data.forEach(asset => {
          list.push({
            id: cex.id + '-' + asset.symbol,
            symbol: asset.symbol,
            subtitle: cex.title,
            balance: formatCoins(asset.balance),
            price: asset.price,
            totalValue: formatPrice(asset.totalValue),
            logo: cex.logo,
            image: asset.image,
          });
        });
      });
      return list;
    } catch (error) {
      Logs.error(error);
      return [];
    }
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={{justifyContent: 'center', flex: 1}}>
        {CexStore.cexs.length > 0 ? (
          <FlatList
            data={mapItems() || []}
            renderItem={renderItem}
            keyExtractor={(item: any, index) =>
              item.cid + item.chain + index.toString() ?? ''
            }
            maxToRenderPerBatch={10}
            initialNumToRender={6}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={listHeader()}
            style={{marginHorizontal: 10}}
          />
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('CEXScreen')}
            style={{
              marginTop: 0,
              marginHorizontal: 16,
              flexGrow: 1,
              height: SIZE.height / 1.5,
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: 150,
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                opacity: 0.2,
              }}>
              <Icon name="link" size={120} color={'gray'} />
            </View>
            <Text
              style={{
                fontSize: 21,
                color: 'gray',
                textAlign: 'center',
                fontWeight: 'bold',
                opacity: 0.2,
                height: 50,
              }}>
              {t('portfolio.empty_your_cexs')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

export default CEXs;
