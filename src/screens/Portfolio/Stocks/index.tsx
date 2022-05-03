/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, createRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice, formatNoComma} from 'utils';
import ActionSheet from 'react-native-actions-sheet';
import StockService from 'services/stocks';
import {SmallButton} from 'components/smallButton';
import {IStocks, StockStore} from 'stores/StockStore';
import {SIZE} from 'utils/constants';
import {useTranslation} from 'react-i18next';
import {Logs} from 'services/logs';

const editSheet: React.RefObject<any> = createRef();

const Stocks = observer(() => {
  const navigation = useNavigation();
  const [selected, setselected] = useState<IStocks | null>(null);
  const [accBalance, setAccBalance] = useState('');
  const [showAvatar, setShowAvatar] = useState(false);

  const {t} = useTranslation();
  useEffect(() => {
    setShowAvatar(true);
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchStocks')}
          style={styles.moreBtn}>
          <Icon2 name="addchart" size={24} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    StockService.updateAllStocks();
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
      showAvatar={showAvatar}
    />
  );
  const listHeader = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>{t('portfolio.stocks.title')}</Text>
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
            data={StockStore.stocks.slice() || []}
            renderItem={renderItem}
            keyExtractor={(item: any, index) =>
              item.id + index.toString() ?? ''
            }
            maxToRenderPerBatch={10}
            initialNumToRender={6}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={listHeader()}
            style={{marginHorizontal: 10}}
          />
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchStocks')}
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
              <Icon2 name="addchart" size={120} color={'gray'} />
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
              {t('portfolio.empty_your_stocks')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <ActionSheet
        //@ts-ignore
        ref={editSheet}
        keyboardShouldPersistTaps="always"
        containerStyle={styles.editContainer}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 10,
            paddingRight: 15,
            paddingTop: 15,
          }}
          onPress={() => {
            Alert.alert('Delete', t('portfolio.stocks.delete_title'), [
              {
                text: t('settings.cancel'),
                onPress: () => Logs.info('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: t('settings.yes'),
                onPress: async () => {
                  StockStore.deleteStockById(selected.id);
                  StockStore.updateAllBalances();
                  editSheet.current?.setModalVisible(false);
                },
              },
            ]);
          }}>
          <Icon name="trash" size={20} color={Colors.red} />
        </TouchableOpacity>
        <Text style={styles.editTitle}>
          {t('portfolio.stocks.edit_title') + ' ' + selected?.symbol}
        </Text>
        <Text style={styles.modalsubtitle}>
          {t('portfolio.stocks.edit_amount')}
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
          text={t('portfolio.stocks.update')}
          onPress={() => {
            let balance = formatNoComma(accBalance);
            if (!balance) {
              balance = '0';
            }
            const acc = Object.assign({}, selected);
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
            marginBottom: 20,
          }}
        />
      </ActionSheet>
    </View>
  );
});

export default Stocks;
