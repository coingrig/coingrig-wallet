/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {createRef, useEffect, useState} from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountItem from 'components/Account';
import {Colors} from 'utils/colors';
import {styles} from '../styles';
import {formatPrice} from 'utils';
import {FiatStore, IFiatAccounts} from 'stores/fiatStore';
import ActionSheet from 'react-native-actions-sheet';
import {SmallButton} from 'components/smallButton';
import {useTranslation} from 'react-i18next';

const editSheet: React.RefObject<any> = createRef();

const Fiat = observer(props => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [selected, setselected] = useState<IFiatAccounts | null>(null);

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
        editSheet.current?.setModalVisible(true);
      }}
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
          value={null}
          onChangeText={t => null}
        />
        <SmallButton
          text={t('swap.slippage_save')}
          onPress={() => {
            null;
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

export default Fiat;
