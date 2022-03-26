/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, createRef, useState} from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice} from 'utils';
import ActionSheet from 'react-native-actions-sheet';
import {SmallButton} from 'components/smallButton';
import {IStocks, StockStore} from 'stores/StockStore';
import {useTranslation} from 'react-i18next';

const editSheet: React.RefObject<any> = createRef();

const Stocks = observer(props => {
  const navigation = useNavigation();
  const [selected, setselected] = useState<IStocks | null>(null);
  const [accBalance, setAccBalance] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchStocks')}
          style={styles.moreBtn}>
          <Icon name="add-circle" size={25} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const renderItem = ({item}: {item: IStocks}) => (
    <AccountItem
      key={item.id}
      disable={false}
      onPress={() => {
        setselected(item);
        setAccBalance((item?.qty ?? '').toString());
        editSheet.current?.setModalVisible(true);
      }}
      title={item.symbol || ''}
      value={formatPrice(item.price * item.qty)}
      subvalue={formatPrice(item.price, true) || ''}
      subtitle={item.name || ''}
      img={null}
    />
  );
  const listHeader = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>{'Stocks'}</Text>
        <Text style={styles.subRight}>
          {formatPrice(StockStore.totalBalance, true) || 0.0}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={{justifyContent: 'center', flex: 1}}>
        <FlatList
          data={StockStore.stocks.slice()}
          renderItem={renderItem}
          keyExtractor={(item: any, index) => item.id + index.toString() ?? ''}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader()}
          style={{marginHorizontal: 10}}
        />
      </View>
      <ActionSheet
        //@ts-ignore
        ref={editSheet}
        keyboardShouldPersistTaps="always"
        // gestureEnabled={true}
        // headerAlwaysVisible
        containerStyle={styles.editContainer}>
        <Text style={styles.editTitle}>{t('wallet.edit')}</Text>
        <TextInput
          placeholder={'ceva'}
          keyboardType="numeric"
          placeholderTextColor={'gray'}
          style={styles.editInput}
          value={accBalance}
          onChangeText={t => setAccBalance(t)}
        />
        <SmallButton
          text={t('swap.slippage_save')}
          onPress={() => {
            let balance = parseFloat(accBalance);
            if (!balance) {
              balance = 0;
            }
            let acc = Object.assign({}, selected);
            acc.qty = balance;
            StockStore.updateStock(acc.id, acc);
            StockStore.updateAllBalances();
            editSheet.current?.setModalVisible(false);
          }}
          color="#f2eded"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: '#2e2c2c',
            width: '70%',
            marginTop: 20,
          }}
        />
      </ActionSheet>
    </View>
  );
});

export default Stocks;
