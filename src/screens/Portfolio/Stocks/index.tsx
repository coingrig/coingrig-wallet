/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, createRef, useState} from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice, formatNoComma} from 'utils';
import ActionSheet from 'react-native-actions-sheet';
import {SmallButton} from 'components/smallButton';
import {IStocks, StockStore} from 'stores/StockStore';
import {SIZE} from 'utils/constants';
import FastImage from 'react-native-fast-image';
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
      subimg={null}
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
        {StockStore.stocks.length > 0 ? (
          <FlatList
            data={StockStore.stocks.slice()}
            renderItem={renderItem}
            keyExtractor={(item: any, index) =>
              item.id + index.toString() ?? ''
            }
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={listHeader()}
            style={{marginHorizontal: 10}}
          />
        ) : (
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 16,
              flexGrow: 1,
              height: SIZE.height / 1.5,
              justifyContent: 'center',
            }}>
            <FastImage
              source={require('../../../assets/nft.png')}
              resizeMode="contain"
              style={{
                height: 150,
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
                opacity: 0.5,
              }}
            />
            <Text
              style={{
                fontSize: 20,
                color: Colors.lighter,
                textAlign: 'center',
                fontWeight: 'bold',
                opacity: 0.5,
                marginTop: 50,
              }}>
              {t('dashboard.coming_soon').toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <ActionSheet
        //@ts-ignore
        ref={editSheet}
        keyboardShouldPersistTaps="always"
        containerStyle={styles.editContainer}>
        <Text style={styles.editTitle}>
          {t('wallet.edit') + ' ' + selected?.symbol}
        </Text>
        <Text style={styles.modalsubtitle}>
          {t('Enter the number of shares')}
        </Text>
        <TextInput
          placeholder={'0'}
          keyboardType="numeric"
          placeholderTextColor={'gray'}
          style={styles.editInput}
          value={accBalance}
          onChangeText={t => setAccBalance(t)}
        />
        <SmallButton
          text={t('swap.slippage_save')}
          onPress={() => {
            let balance = formatNoComma(accBalance);
            if (!balance) {
              balance = '0';
            }
            let acc = Object.assign({}, selected);
            acc.qty = parseFloat(balance);
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
        <TouchableOpacity
          onPress={() => {
            StockStore.deleteStockById(selected.id);
            editSheet.current?.setModalVisible(false);
          }}>
          <Text style={styles.modaldelete}>{t('Delete')}</Text>
        </TouchableOpacity>
      </ActionSheet>
    </View>
  );
});

export default Stocks;
