import React, {useEffect, useState} from 'react';
import {View, ScrollView, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ReceiveContainer} from 'components/Receive';
import {SendContainer} from 'components/Send';
import {WalletStore} from 'stores/wallet';
import {useTransitionEnd} from 'utils/hooks/useTransitionEnd';
import {styles} from './styles';
import {Colors} from 'utils/colors';
import {Segment, SegmentedControl} from 'react-native-resegmented-control';
import {useTranslation} from 'react-i18next';
import {CryptoService} from 'services/crypto';

const SendReceiveScreen = ({route}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [isReceive, setIsReceive] = useState(route.params.receive);
  const [address, setAddress] = useState('loading...');
  const [coinDescriptor, setCoinDescriptor] = useState({});
  const tEnded = useTransitionEnd(navigation);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.coin,
    });
    const wallet = WalletStore.getWalletByCoinId(
      route.params.coin,
      route.params.chain,
    );
    setAddress(WalletStore.getWalletAddressByChain(wallet?.chain ?? '') ?? '');
    setCoinDescriptor(wallet ?? {});
    CryptoService.getAccountBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = () => {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator color={Colors.foreground} size="large" />
      </View>
    );
  };
  const renderContainer = () => {
    if (isReceive) {
      return tEnded ? (
        <ReceiveContainer address={address} chain={route.params.chain} />
      ) : (
        loading()
      );
    } else {
      return tEnded ? (
        <SendContainer
          coin={route.params.coin}
          chain={route.params.chain}
          address={address}
          to={route.params.to ?? null}
          coinDescriptor={coinDescriptor}
        />
      ) : (
        loading()
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <SegmentedControl
        inactiveTintColor={Colors.lighter}
        initialSelectedName={isReceive ? 'receive' : 'send'}
        style={styles.segment}
        onChangeValue={name =>
          name === 'receive' ? setIsReceive(true) : setIsReceive(false)
        }>
        <Segment name="receive" content={t('tx.receive')} />
        <Segment
          name="send"
          content={t('tx.send')}
          disabled={route.params.nft ? true : false}
        />
      </SegmentedControl>
      {renderContainer()}
    </ScrollView>
  );
};

export default SendReceiveScreen;
