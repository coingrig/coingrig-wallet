/* eslint-disable react-hooks/exhaustive-deps */
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
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice, formatNoComma} from 'utils';
import {FiatStore, IFiatAccounts} from 'stores/fiatStore';
import ActionSheet from 'react-native-actions-sheet';
import {SmallButton} from 'components/smallButton';
import {useTranslation} from 'react-i18next';
import {SIZE} from 'utils/constants';
import {Logs} from 'services/logs';

const editSheet: React.RefObject<any> = createRef();

const Fiat = observer(() => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [selected, setSelected] = useState<IFiatAccounts | null>(null);
  const [accBalance, setAccBalance] = useState('');
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddFiat')}
          style={styles.moreBtn}>
          <Icon2 name="cash-plus" size={28} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    setShowAvatar(true);
  }, []);

  const renderItem = ({item}: {item: IFiatAccounts}) => (
    <AccountItem
      key={item.id}
      disable={false}
      onPress={() => {
        setSelected(item);
        setAccBalance((item?.balance ?? '').toString());
        editSheet.current?.setModalVisible(true);
      }}
      title={item.name || ''}
      value={item.balance + ' ' + item.currency || ''}
      subvalue={
        item.usdBalance === undefined
          ? '-'
          : formatPrice(item.usdBalance, true) || ''
      }
      subtitle={''}
      img={null}
      subimg={null}
      showAvatar={showAvatar}
    />
  );
  const listHeader = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>{t('portfolio.fiat.title')}</Text>
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
            initialNumToRender={6}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={listHeader()}
            style={{marginHorizontal: 10}}
          />
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('AddFiat')}
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
              <Icon2 name="cash-plus" size={120} color={'gray'} />
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
              {t('portfolio.empty_your_cash')}
            </Text>
          </TouchableOpacity>
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
            Alert.alert('Delete', t('portfolio.fiat.delete_title'), [
              {
                text: t('settings.cancel'),
                onPress: () => Logs.info('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: t('settings.yes'),
                onPress: async () => {
                  FiatStore.deleteAccountById(selected?.id as string);
                  FiatStore.updateTotalBalance(FiatStore.sumTotalBalance());
                  editSheet.current?.setModalVisible(false);
                },
              },
            ]);
          }}>
          <Icon name="trash" size={20} color={Colors.red} />
        </TouchableOpacity>
        <Text style={styles.editTitle}>
          {t('portfolio.fiat.edit_title') + ' ' + selected?.name}
        </Text>
        <Text style={styles.modalsubtitle}>
          {t('portfolio.fiat.edit_amount') + ' ' + selected?.currency}
        </Text>
        <TextInput
          placeholder={'0'}
          keyboardType="numeric"
          placeholderTextColor={'gray'}
          style={styles.editInput}
          value={accBalance}
          onChangeText={v => setAccBalance(v)}
        />
        <SmallButton
          text={t('portfolio.fiat.save')}
          onPress={() => {
            let balance = formatNoComma(accBalance);
            if (!balance) {
              balance = '0';
            }
            const acc = Object.assign({}, selected);
            acc.balance = parseFloat(balance);
            FiatStore.updateAccount(acc.id, acc);
            FiatStore.updateAllBalances();
            editSheet.current?.setModalVisible(false);
          }}
          color="#f2eded"
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
