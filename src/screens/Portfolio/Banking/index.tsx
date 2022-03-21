/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import Analytics from 'appcenter-analytics';
import React, {useEffect} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice} from 'utils';
import {BankStore, IBankAccount} from 'stores/bankStore';

const Banking = observer(() => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('SelectCountryScreen')}
          style={styles.moreBtn}>
          <Icon name="bank-plus" size={25} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    Analytics.trackEvent('Screen', {name: 'Portfolio/Banking'});
  }, []);

  const renderItem = ({item}: {item: IBankAccount}) => (
    <AccountItem
      key={item.iban}
      disable={true}
      onPress={null}
      title={item.bankName || ''}
      img={item.bankLogo || ''}
      subtitle={item.iban || ''}
      value={item.amount + ' ' + item.currency || ''}
      subvalue={item.name || ''}
    />
  );
  const listHeader = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>{'Accounts'}</Text>
        <Text style={styles.subRight}>
          {formatPrice(BankStore.totalBalance, true) || 0.0}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={{justifyContent: 'center', flex: 1}}>
        <FlatList
          data={BankStore.bankAccounts || []}
          renderItem={renderItem}
          keyExtractor={(item: any, index) => item.id + index.toString() ?? ''}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader()}
          style={{marginHorizontal: 10}}
          scrollEventThrottle={100}
        />
      </View>
    </View>
  );
});

export default Banking;
