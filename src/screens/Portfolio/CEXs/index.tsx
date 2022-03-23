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
import {CexStore} from 'stores/cexStore';
import {Logs} from 'services/logs';

const CEXs = observer(props => {
  const navigation = useNavigation();

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
  }, []);

  const renderItem = ({item}: {item: any}) => (
    <AccountItem
      key={item.id}
      disable={true}
      onPress={null}
      title={item.symbol || ''}
      img={item.logo || ''}
      subtitle={item.subtitle || ''}
      value={item.balance + ' ' + item.symbol || ''}
      subvalue={item.totalValue || ''}
    />
  );
  const listHeader = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>{'Tokens'}</Text>
        <Text style={styles.subRight}>
          {formatPrice(CexStore.totalBalance, true) || 0.0}
        </Text>
      </View>
    );
  };

  const mapItems = () => {
    let list: any[] = [];
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
        <FlatList
          data={mapItems() || []}
          renderItem={renderItem}
          keyExtractor={(item: any, index) =>
            item.cid + item.chain + index.toString() ?? ''
          }
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader()}
          style={{marginHorizontal: 10}}
          scrollEventThrottle={300}
          onScroll={e => props.onScroll(e.nativeEvent.contentOffset.y)}
        />
      </View>
    </View>
  );
});

export default CEXs;
