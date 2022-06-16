/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CryptoService} from 'services/crypto';
import {Colors} from 'utils/colors';
import FastImage from 'react-native-fast-image';
import {formatTime, openLink} from 'utils';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import {Loader} from 'components/loader';
import {useNavigation} from '@react-navigation/native';
import {ZEROX_FEE_PROXY} from 'utils/constants';
import BigNumber from 'bignumber.js';
import {useTranslation} from 'react-i18next';
import {ILogEvents, LogEvents} from 'utils/analytics';
import {WalletStore} from 'stores/wallet';

export default function ReferralHistory({route}) {
  const [txList, setTxList] = useState([]);
  const [tokenDict, setTokenDict] = useState({});
  const [empty, setEmpty] = useState(false);
  const navigation = useNavigation();
  const {t} = useTranslation();

  useEffect(() => {
    fetchData();
    LogEvents(ILogEvents.SCREEN, 'ReferralEarnings');
  }, []);

  const fetchData = async () => {
    const referal = route.params.referal;
    const userAddress = WalletStore.getWalletAddressByChain('ETH');
    const data = await CryptoService.getReferralHistory(0, userAddress);
    const newDict = {...tokenDict, ...data.data.token_dict};
    setTokenDict(newDict);
    let list = data.data.history_list;
    if (referal) {
      list = list.filter(
        item =>
          item.cate_id === 'receive' && item.other_addr === ZEROX_FEE_PROXY,
      );
    }
    if (list.length === 0) {
      setEmpty(true);
    } else {
      setTxList(list);
    }
  };

  const getTokenName = item => {
    const token = tokenDict[getTokenId(item)];
    if (!token) {
      return t('history.unkown_token');
    }
    const name = token.symbol ? token.symbol : token.name;
    return name;
  };

  const getTokenId = item => {
    let tokenid = item.receives[0]?.token_id
      ? item.receives[0]?.token_id
      : item.sends[0]?.token_id;
    tokenid = tokenid ? tokenid : item.token_approve?.token_id;
    return tokenid;
  };

  const getImg = item => {
    let imgSource: any = null;
    const tokenId = getTokenId(item);
    if (item.receives.length > 0) {
      imgSource = tokenDict[tokenId].logo_url;
    } else if (item.sends.length > 0) {
      imgSource = tokenDict[tokenId].logo_url;
    } else if (item.cate_id === 'approve') {
      imgSource = tokenDict[tokenId].logo_url;
    } else {
      imgSource = 'https://etherscan.com/images/main/empty-token.png';
    }
    imgSource = imgSource
      ? imgSource
      : 'https://etherscan.com/images/main/empty-token.png';
    return (
      <FastImage
        style={{width: 30, height: 30}}
        source={{
          uri: imgSource,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
      />
    );
  };

  const renderAdd = item => {
    const chainToOpen = item.chain === 'matic' ? 'polygon' : item.chain;
    const tokenCtr = tokenDict[getTokenId(item)].id;
    if (tokenCtr === 'matic' || tokenCtr === 'bsc' || tokenCtr === 'eth') {
      return <View style={{width: 35}} />;
    }
    return (
      <TouchableOpacity
        style={{paddingHorizontal: 5}}
        onPress={() => {
          navigation.navigate('CustomTokenScreen', {
            chain: chainToOpen,
            token: tokenCtr,
          });
        }}>
        <Icon name="add" size={25} color={Colors.green} />
      </TouchableOpacity>
    );
  };

  const formatAmount = amount => {
    return new BigNumber(amount.toString()).toFixed(10);
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 15,
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {getImg(item)}
        <View style={{flex: 1}}>
          <Text
            style={{
              marginHorizontal: 10,
              color: Colors.foreground,
              fontSize: 14,
              fontWeight: 'bold',
            }}>
            {getTokenName(item)}
          </Text>
          <Text
            style={{
              marginHorizontal: 10,
              color: Colors.foreground,
              fontSize: 12,
              paddingTop: 5,
              letterSpacing: -0.5,
            }}>
            {formatTime(item.time_at)} {' | '}
            {item.chain === 'matic' ? 'Polygon' : item.chain.toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <Text
            style={{
              marginHorizontal: 10,
              color: Colors.lighter,
              fontSize: 12,
              width: 80,
              textAlign: 'right',
            }}
            numberOfLines={1}>
            {formatAmount(item.receives[0].amount)}
          </Text>
          <View
            style={{
              flex: 1,
              paddingTop: 5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              width: 70,
              alignItems: 'center',
            }}>
            {renderAdd(item)}
            <TouchableOpacity
              style={{paddingHorizontal: 10}}
              onPress={() => {
                const chainToOpen =
                  item.chain === 'matic' ? 'polygon' : item.chain;
                openLink(
                  CryptoService.getTxExplorer(
                    chainToOpen.toUpperCase(),
                    item.id,
                  ),
                );
              }}>
              <Icon2 name="external-link" size={17} color={Colors.blue} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
      {txList.length > 0 ? (
        <FlatList
          data={txList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{height: 1, backgroundColor: Colors.border}} />
          )}
          style={{
            paddingHorizontal: 16,
          }}
          ListHeaderComponent={null}
          ListFooterComponent={() => <View style={{height: 30}} />}
        />
      ) : !empty ? (
        <Loader />
      ) : (
        <Text
          style={{textAlign: 'center', fontSize: 20, color: Colors.lighter}}>
          {t('history.referal.no_data')}
        </Text>
      )}
    </View>
  );
}
