/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice} from 'utils';
import {FiatStore, IFiatAccounts} from 'stores/fiatStore';

const Fiat = observer(props => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddFiat')}
          style={styles.moreBtn}>
          <Icon name="add-circle" size={25} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const renderItem = ({item}: {item: IFiatAccounts}) => (
    <AccountItem
      key={item.id}
      disable={true}
      onPress={null}
      title={item.name || ''}
      value={item.balance + ' ' + item.currency || ''}
      subvalue={formatPrice(item.usdBalance, true) || ''}
      subtitle={''}
      img={null}
    />
  );
  const listHeader = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>{'Accounts'}</Text>
        <Text style={styles.subRight}>
          {formatPrice(FiatStore.totalBalance, true) || 0.0}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={{justifyContent: 'center', flex: 1}}>
        <FlatList
          data={FiatStore.fiatAccounts.slice() || []}
          renderItem={renderItem}
          keyExtractor={(item: any, index) => item.id + index.toString() ?? ''}
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

export default Fiat;
