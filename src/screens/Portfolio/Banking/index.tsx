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
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatNoComma, formatPrice} from 'utils';
import {BankStore, IBankAccount} from 'stores/bankStore';
import BanksService from 'services/banks';
import ActionSheet from 'react-native-actions-sheet';
import {SmallButton} from 'components/smallButton';
import {useTranslation} from 'react-i18next';
import {SIZE} from 'utils/constants';

const detailsSheet: React.RefObject<any> = createRef();

const Banking = observer(() => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [selected, setselected] = useState<IBankAccount | null>(null);
  const [showOffset, setShowOffset] = useState<boolean>(false);
  const [offset, setOffset] = useState<string>('0');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('SelectCountryScreen')}
          style={styles.moreBtn}>
          <Icon name="bank-plus" size={24} color={Colors.foreground} />
        </TouchableOpacity>
      ),
    });
    // BanksService.updateAccountsBalance();
  }, []);

  const shareIban = async iban => {
    await Share.open({
      title: '',
      message: iban,
    });
  };

  const renderItem = ({item}: {item: IBankAccount}) => (
    <AccountItem
      key={item.iban || item.ownerName}
      disable={false}
      onPress={() => {
        setShowOffset(false);
        setOffset(item.offset?.toString());
        setselected(item);
        detailsSheet.current?.setModalVisible(true);
      }}
      title={item.bankName || ''}
      img={item.bankLogo || ''}
      subtitle={item.iban || ''}
      value={item.amount + ' ' + item.currency || ''}
      subvalue={item.name || ''}
      subimg={null}
      showAvatar={null}
    />
  );
  const listHeader = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.subLeft}>{t('portfolio.banks.accounts')}</Text>
        <Text style={styles.subRight}>
          {formatPrice(BankStore.totalBalance, true) || 0.0}
        </Text>
      </View>
    );
  };

  const deleteAccount = async acc => {
    Alert.alert(
      t('portfolio.banks.delete_confirmation'),
      t('portfolio.banks.delete_description'),
      [
        {
          text: t('settings.cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: t('settings.yes'),
          onPress: async () => {
            BankStore.deleteAccountById(acc);
            BanksService.updateTotalBalance();
            detailsSheet.current?.setModalVisible(false);
          },
        },
      ],
    );
  };

  const renderOffset = () => {
    return (
      <>
        <Text style={styles.editTitle}>
          {t('portfolio.banks.edit_offset_title')}
        </Text>
        <Text style={styles.modalsubtitle}>
          {t('portfolio.banks.edit_offset_description')}
        </Text>
        <TextInput
          placeholder={'0'}
          keyboardType="numeric"
          placeholderTextColor={'gray'}
          style={styles.editInput}
          value={offset.toString()}
          onChangeText={t => setOffset(t)}
        />
        <SmallButton
          text={t('swap.slippage_save')}
          onPress={() => {
            let fOffset = formatNoComma(offset);
            if (!fOffset || offset.length === 0) {
              fOffset = '0';
            }
            BanksService.updateAccountsOffset(selected.id, offset);
            detailsSheet.current?.setModalVisible(false);
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
      </>
    );
  };

  const renderModalData = () => {
    return (
      <>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 10,
            paddingRight: 15,
            paddingTop: 15,
          }}
          onPress={() => setShowOffset(true)}>
          <Icon name="circle-edit-outline" size={22} color={Colors.blue} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            marginTop: 25,
            marginBottom: 20,
            fontFamily: 'RobotoSlab-Bold',
            color: Colors.foreground,
          }}>
          {selected?.ownerName || t('portfolio.banks.bank_account')}
        </Text>

        <View style={{marginHorizontal: 16}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: Colors.foreground,
            }}>
            {t('portfolio.banks.bank') + selected?.bankName}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              marginVertical: 5,
              color: Colors.foreground,
            }}>
            {t('portfolio.banks.iban') + selected?.iban}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: Colors.foreground,
            }}>
            {t('portfolio.banks.currency') + selected?.currency}
          </Text>
        </View>
        <SmallButton
          text={t('portfolio.banks.share_iban_btn')}
          onPress={() => shareIban(selected?.iban)}
          color={Colors.background}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: Colors.foreground,
            width: '70%',
            marginTop: 30,
            borderColor: Colors.foreground,
          }}
        />
        <SmallButton
          text={t('portfolio.banks.delete_account_btn')}
          onPress={() => {
            deleteAccount(selected?.id!);
          }}
          color="#f2eded"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: Colors.red,
            width: '70%',
            marginTop: 0,
            borderColor: Colors.red,
          }}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: Colors.lighter,
            marginTop: 10,
          }}>
          {t('portfolio.banks.expiration_date') + selected?.expire!}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: Colors.lighter,
            marginTop: 5,
          }}>
          {t('portfolio.banks.access_read_only')}
        </Text>
      </>
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={{justifyContent: 'center', flex: 1}}>
        {BankStore.bankAccounts.length > 0 ? (
          <FlatList
            data={BankStore.bankAccounts}
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
            onPress={() => navigation.navigate('SelectCountryScreen')}
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
              <Icon name="bank-plus" size={120} color={'gray'} />
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
              {t('portfolio.empty_your_banks')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <ActionSheet
        //@ts-ignore
        ref={detailsSheet}
        keyboardShouldPersistTaps="always"
        containerStyle={{backgroundColor: Colors.background}}
        // gestureEnabled={true}
        // headerAlwaysVisible
      >
        {showOffset ? renderOffset() : renderModalData()}
      </ActionSheet>
    </View>
  );
});

export default Banking;
