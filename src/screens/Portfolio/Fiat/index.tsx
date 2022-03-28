/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {createRef, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice, formatNoComma} from 'utils';
import {FiatStore, IFiatAccounts} from 'stores/fiatStore';
import ActionSheet from 'react-native-actions-sheet';
import {SmallButton} from 'components/smallButton';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {SIZE} from 'utils/constants';

const editSheet: React.RefObject<any> = createRef();

const Fiat = observer(props => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [selected, setselected] = useState<IFiatAccounts | null>(null);
  const [accBalance, setAccBalance] = useState('');

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
      disable={false}
      onPress={() => {
        setselected(item);
        setAccBalance((item?.balance ?? '').toString());
        editSheet.current?.setModalVisible(true);
      }}
      title={item.name || ''}
      value={item.balance + ' ' + item.currency || ''}
      subvalue={formatPrice(item.usdBalance, true) || ''}
      subtitle={''}
      img={null}
      subimg={null}
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
        {FiatStore.fiatAccounts.length > 0 ? (
          <FlatList
            data={FiatStore.fiatAccounts.slice() || []}
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
        // gestureEnabled={true}
        // headerAlwaysVisible
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
            Alert.alert('Delete', t('Are you sure you want to delete ?'), [
              {
                text: t('settings.cancel'),
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: t('settings.yes'),
                onPress: async () => {
                  FiatStore.deleteAccountById(selected?.id);
                  editSheet.current?.setModalVisible(false);
                },
              },
            ]);
          }}>
          <Icon name="trash" size={20} color={Colors.red} />
        </TouchableOpacity>
        <Text style={styles.editTitle}>
          {t('wallet.edit') + ' ' + selected?.currency}
        </Text>
        <Text style={styles.modalsubtitle}>
          {t('Update the amount in') + ' ' + selected?.currency}
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
            acc.balance = parseFloat(balance);
            FiatStore.updateAccount(acc.id, acc);
            FiatStore.updateAllBalances();
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

export default Fiat;
