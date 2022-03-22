/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import Analytics from 'appcenter-analytics';
import React, {createRef, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice} from 'utils';
import {BankStore, IBankAccount} from 'stores/bankStore';
import BanksService from 'services/banks';
import ActionSheet from 'react-native-actions-sheet';
import {SmallButton} from 'components/smallButton';
import {useTranslation} from 'react-i18next';

const detailsSheet: React.RefObject<any> = createRef();

const Banking = observer(() => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [selected, setselected] = useState<IBankAccount | null>(null);

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
        setselected(item);
        console.log(item);
        detailsSheet.current?.setModalVisible(true);
      }}
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
          data={BankStore.bankAccounts}
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
      <ActionSheet
        //@ts-ignore
        ref={detailsSheet}
        keyboardShouldPersistTaps="always"
        containerStyle={{backgroundColor: Colors.card}}
        // gestureEnabled={true}
        // headerAlwaysVisible
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            marginTop: 25,
            marginBottom: 20,
            fontFamily: 'RobotoSlab-Bold',
            color: Colors.foreground,
          }}>
          {selected?.ownerName}
        </Text>

        <View style={{marginHorizontal: 16}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 17,
              color: Colors.foreground,
            }}>
            {'Bank: ' + selected?.bankName}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 17,
              marginVertical: 5,
              color: Colors.foreground,
            }}>
            {'IBAN: ' + selected?.iban}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 17,
              color: Colors.foreground,
            }}>
            {'Currency: ' + selected?.currency}
          </Text>
        </View>
        <SmallButton
          text={t('Share IBAN')}
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
          text={t('Remove account')}
          onPress={() => {
            BankStore.deleteAccountById(selected?.id!);
            BanksService.updateTotalBalance();
            detailsSheet.current?.setModalVisible(false);
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
          {'Access expiration date: ' + selected?.expire!}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: Colors.lighter,
            marginTop: 5,
          }}>
          {'Access type: Read Only'}
        </Text>
      </ActionSheet>
    </View>
  );
});

export default Banking;
