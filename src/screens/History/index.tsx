/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CryptoService} from 'services/crypto';
import {WalletStore} from 'stores/wallet';
import {Colors} from 'utils/colors';
import FastImage from 'react-native-fast-image';
import {capitalizeFirstLetter, formatTime, openLink} from 'utils';
import {Loader} from 'components/loader';
import {useNavigation} from '@react-navigation/native';

export default function HistoryScreen({route}) {
  const [txList, setTxList] = useState([]);
  const [tokenDict, setTokenDict] = useState({});
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.chain.toUpperCase() + ' ' + 'History',
    });
    fetchData();
  }, []);

  const fetchData = async () => {
    const chain = route.params.chain;
    const userAddress = WalletStore.getWalletAddressByChain('ETH');
    const data = await CryptoService.getChainHistory(0, userAddress, chain);
    const newDict = {...tokenDict, ...data.data.token_dict};
    setTokenDict(newDict);
    let list = data.data.history_list;
    if (chain) {
      list = list.filter(item => item.chain === chain);
    }
    setTxList(list);
  };

  const isSwap = item => {
    return (
      item.cate_id == null && item.receives.length > 0 && item.sends.length > 0
    );
  };

  const getTokenName = item => {
    const token = tokenDict[getTokenId(item)];
    if (!token) {
      return 'Unknown';
    }
    const name = token.symbol ? token.symbol : token.name;
    return name;
  };

  const getTokenId = item => {
    let tokenid = item.receives[0]?.token_id
      ? item.receives[0]?.token_id
      : item.sends[0]?.token_id;
    tokenid = tokenid ? tokenid : item.token_approve?.token_id;
    // tokenid = tokenid ? tokenid :
    return tokenid;
  };

  const getImg = item => {
    // tokenDict['0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39'].logo_url
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

  const getCat = item => {
    if (
      item.cate_id === 'receive' &&
      item.other_addr === '0xdb6f1920a889355780af7570773609bd8cb1f498'
    ) {
      return 'Referal Commision';
    }
    return isSwap(item)
      ? 'Swap'
      : item.cate_id === null
      ? item.tx.name
      : item.cate_id;
  };

  const renderItem = ({item}) => {
    // console.log(tokenDict[getTokenId(item)]);
    let category = getCat(item);
    category = category ? category : 'Unknown';

    return (
      <TouchableOpacity
        onPress={() => {
          const chainToOpen = item.chain === 'matic' ? 'polygon' : item.chain;
          openLink(
            CryptoService.getTxExplorer(chainToOpen.toUpperCase(), item.id),
          );
        }}
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
            {formatTime(item.time_at)}
          </Text>
        </View>
        <Text
          style={{
            marginHorizontal: 10,
            color: Colors.lighter,
            fontSize: 12,
            width: 80,
            textAlign: 'right',
          }}
          numberOfLines={2}>
          {capitalizeFirstLetter(category)}
        </Text>
      </TouchableOpacity>
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
      ) : (
        <Loader />
      )}
    </View>
  );
}
